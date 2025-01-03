const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const env = loadEnvFile('./.env');

const fs = require('fs');
const path = require('path');
const sqlDir = path.join(__dirname, '../../sql');

const poolAttributes = {
  user: env.ORACLE_USER,
  password: env.ORACLE_PASS,
  connectString: `${env.ORACLE_HOST}:${env.ORACLE_PORT}/${env.ORACLE_DBNAME}`,
  poolMin: 1,
  poolMax: 3,
  poolIncrement: 1,
  poolTimeout: 60
};

class AppService {
  constructor() {
    this.initialized = false;
    this.initializing = false;
    this.tables = {};
  }

  async Initialize() {
    if (this.initializing) {
      return new Promise((resolve, _reject) => {
        setInterval(() => {
          if (this.initialized) {
            resolve(true);
            clearInterval();
          }
        }, 10);
      });
    }
    this.initializing = true;
    try {
      await oracledb.createPool(poolAttributes);
      console.log('Connection pool started');
      process
        .once('SIGTERM', this.close)
        .once('SIGINT', this.close);
      this.initialized = true;
    } catch (err) {
      console.error('Initialization error: ' + err.message);
    }
  }

  async close() {
    console.log('\nTerminating');
    try {
      await oracledb.getPool().close(10);
      console.log('Pool closed');
      process.exit(0);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  async withConnection(handler) {
    if (!this.initialized) {
      await this.Initialize();
    }

    let connection;
    try {
      connection = await oracledb.getConnection();
      return await handler(connection);
    } catch(err) {
      console.error(err);
      throw err;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async isConnected() {
    return await this.withConnection(async (connection) => {
      return true;
    }).catch(() => {
      return false;
    });
  }

  async fetchTable(table) {
    return await this.withConnection(async (connection) => {
      const result = await connection.execute(`SELECT * FROM ${table}`);
      return result.rows;
    }).catch(() => {
      return [];
    });
  }

  async fetchJoined(tables) {
    return await this.withConnection(async (connection) => {
      await connection.execute(
        `CREATE OR REPLACE VIEW TEMPVIEW AS
        SELECT * FROM ${tables.join(' NATURAL JOIN ')}`);
      const data = await connection.execute(`SELECT * FROM TEMPVIEW`);
      const names = await connection.execute(
        `SELECT COLUMN_NAME
        FROM USER_TAB_COLUMNS
        WHERE TABLE_NAME = 'TEMPVIEW'`);
      return { table: data.rows, names: names.rows.map(x => x[0]) };
    }).catch((err) => {
      return { error: err };
    });
  }

  async getTableData(table) {
    return await this.withConnection(async (connection) => {
      const result = await connection.execute(
        `SELECT column_name, data_type, data_length
        FROM USER_TAB_COLUMNS
        WHERE TABLE_NAME = '${table.toUpperCase()}'`);
      return result.rows;
    }).catch(() => {
      return [];
    });
  }

  async getTableNames() {
    return await this.withConnection(async (connection) => {
      const result = await connection.execute(`SELECT TABLE_NAME FROM USER_TABLES`);
      return result.rows.map(row => row[0]);
    }).catch((err) => {
      // return [];
      throw new Error(err);
    });
  }

  async reset(iteration = 0) {
    const tables = await this.getTableNames();
    let resetAll = true;
    await this.withConnection(async (connection) => {
      for (let table of tables) {
        try {
          await connection.execute(`DROP TABLE ${table}`);
        } catch (err) {
          resetAll = false;
          // console.error(err);
        }
      }
    });
    if (resetAll) {
      console.log('Sucessfully reset.');
      const tables = await this.getTableNames();
      if (tables.length !== 0) {
        throw new Error('Reset without error, however tables still persist.');
      }
      return true;
    }
    if (iteration > 10) {
      console.error('Unable to reset all tables in 10 iterations.');
      return false;
    }
    await this.reset(iteration++);
  }

  async getDatabaseInformation() {
    try {
      const tables = await this.getTableNames();
      for (let table of tables) {
        const data = await this.getTableData(table);
        const columns = await this.fetchTable(table);
        console.log(`  ${table}:\n    Columns: [${data.map(a => `${a[0]} ${a[1]}(${a[2]})`).join(', ')}]\n    Rows:    ${JSON.stringify(columns)}`);
        this.tables[table] = {
          columns: data,
          names: data.map(a => a[0]),
          types: data.map(a => a[1]),
          dataLengths: data.map(a => a[2])
        };
      }
    } catch(err) {
      console.error(err.message);
      return false;
    }
  }

  async initializeTables() {
    // await this.reset(0);
    // let hasError = !this.reset;
    let hasError = false;
    const res = await this.withConnection(async (connection) => {
      const combined = fs.readFileSync(path.join(sqlDir, 'initialize/combined.sql')).toString().replace(/\;/g, '').split('\n\n');
      for (let c of combined) {
        try {
          await connection.execute(c, [], { autoCommit: true });
        } catch (err) {
          console.error(`Error when executing:${c}${err.message}`);
          if (!c.startsWith('DROP')) hasError = true;
        }
      }
      return true;
    }).catch(() => {
      return false;
    });
    if (!res) return false;
    console.log(`Tables created ${hasError ? 'with' : 'without'} errors:`);
    await this.getDatabaseInformation();
    // natural joins
    if (!await this.initializeJoinedStar()) hasError = true;
    if (!await this.initializeJoinedBlackHole()) hasError = true;

    if (hasError) console.warn('Initialization failed!');
    return !hasError;
  }

  async initializeJoinedStar() {
    return await this.withConnection(async (connection) => {
      try {
        await connection.execute(`DROP TABLE STAR`);
      } catch (err) {}
      await connection.execute(
        `CREATE TABLE STAR AS
        SELECT * FROM STAR2 NATURAL JOIN STAR3 NATURAL JOIN STAR4`);
      await connection.commit();
      return true;
    }).catch((err) => {
      console.error(err);
      return false;
    });
  }

  async initializeJoinedBlackHole() {
    return await this.withConnection(async (connection) => {
      try {
        await connection.execute(`DROP TABLE BLACK_HOLE`);
      } catch (err) {}
      await connection.execute(
        `CREATE TABLE BLACK_HOLE AS
        SELECT * FROM BLACK_HOLE2 NATURAL JOIN BLACK_HOLE1`);
      await connection.commit();
      return true;
    }).catch((err) => {
      console.error(err);
      return false;
    });
  }

  async insertTable(table, values) {
    const data = await this.getTableData(table);
    return await this.withConnection(async (connection) => {
      const result = await connection.execute(
        `INSERT INTO ${table} (${data.map(x => x[0]).join(', ')}) VALUES (${data.map(x => ':' + x[0]).join(', ')})`,
        values,
        { autoCommit: true }
      );
      return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
      return false;
    });
  }

  async performPremadeQuery(sql, parameters) {
    return await appService.withConnection(async (connection) => {
      console.log(sql);
      let result;
      for (let sqlSub of sql.split('--split')) {
        result = await connection.execute(sqlSub, parameters);
      }
      return { result: result.rows };
    }).catch((err) => {
      return { error: 'Error whilst running query! ' + err };
    });
  }

  ////////////////////////////////////////////////////////////////////
  async selection(table, condition) {
    return await this.withConnection(async (connection) => {
      const allowedTables = ['Galaxy', 'Halo', 'Black Hole', 'Star', 'Star Cluster', 'Nebula', 'Planetary Body', 'Moon']; 
      if (!allowedTables.includes(table)) {
        throw new Error('Invalid table name provided.');
      }
  
      if (!condition.match(/^[a-zA-Z0-9_.><= ']+$/)) {
        throw new Error('Invalid condition format.');
      }
  
      const query = `
        SELECT *
        FROM ${table}
        WHERE ${condition}
      `;
  
      const result = await connection.execute(query);
      return result.rows;
    });
  }  

  async performSelection(parameters) {
    const { table, condition } = parameters;
    try {
      const result = await this.selection(table, condition);
      return { result };
    } catch (err) {
      return { error: 'Error executing selection: ' + err.message };
    }
  }
  
  async projection(table, columns) {
    return await this.withConnection(async (connection) => {
      const allowedTables = ['Galaxy', 'Halo', 'Black Hole', 'Star', 'Star Cluster', 'Nebula', 'Planetary Body', 'Moon'];
      if (!allowedTables.includes(table)) {
        throw new Error('Invalid table name provided.');
      }
  
      if (!columns.match(/^[a-zA-Z0-9_, ]+$/)) {
        throw new Error('Invalid column names format.');
      }
  
      const query = `
        SELECT ${columns}
        FROM ${table}
      `;
  
      const result = await connection.execute(query);
      return result.rows;
    });
  }

  async performProjection(parameters) {
    const { table, columns } = parameters;
    try {
      const result = await this.projectColumns(table, columns);
      return { result };
    } catch (err) {
      return { error: 'Error executing projection: ' + err.message };
    }
  }
  
  async join(table1, table2, condition) {
    return await this.withConnection(async (connection) => {
      const allowedTables = ['Galaxy', 'Halo', 'Black Hole', 'Star', 'Star Cluster', 'Nebula', 'Planetary Body', 'Moon'];
      if (!allowedTables.includes(table1) || !allowedTables.includes(table2)) {
        throw new Error('Invalid table names provided.');
      }
  
      if (!condition.match(/^[a-zA-Z0-9_.]+ = [a-zA-Z0-9_.]+$/)) {
        throw new Error('Invalid join condition format.');
      }
  
      const query = `
        SELECT *
        FROM ${table1}
        JOIN ${table2}
        ON ${condition}
      `;
  
      const result = await connection.execute(query);
      return result.rows;
    });
  }

  async performJoin(parameters) {
    const { table1, table2, condition } = parameters;
    try {
      const result = await this.join(table1, table2, condition);
      return { result };
    } catch (err) {
      return { error: 'Error executing join query: ' + err.message };
    }
  }
  ////////////////////////////////////////////////////////////////////  

  async insertHalo(params) {
    console.log("Received parameters: ", params);

    // Extract parameters from input
    const { halo_name, h_luminosity, h_galaxy_name } = params;
    console.log("Extracted values - Halo Name:", halo_name, "Luminosity:", h_luminosity, "Galaxy Name:", h_galaxy_name);

    // Ensure all required fields are provided
    if (!halo_name || !h_luminosity || !h_galaxy_name) {
      console.error("Validation failed: Missing required fields.");
      return { error: 'Invalid input: All fields are required.' };
    }

    // Inline SQL query for insertion
    const sqlQuery = `
      INSERT INTO Halo (halo_name, h_luminosity, h_galaxy_name)
      VALUES (:halo_name, :h_luminosity, :h_galaxy_name)
    `;
    console.log("SQL Query to be executed:", sqlQuery);

    try {
      // Execute the query using your database connection
      const success = await this.withConnection(async (connection) => {
        console.log("Established database connection.");
        const result = await connection.execute(sqlQuery, {
          halo_name,
          h_luminosity,
          h_galaxy_name,
        }, { autoCommit: true });
        console.log("SQL Execution Result:", result);
        return result.rowsAffected > 0;
      });

      if (success) {
        console.log("Insertion successful.");
        return { result: 'Tuple successfully added to Halo.' };
      } else {
        console.error("Insertion failed: No rows were affected.");
        return { error: 'Insertion failed. Please check constraints and input values.' };
      }
    } catch (err) {
      console.error("Database operation failed with error:", err);
      return { error: 'Insertion failed. Please check constraints and input values.' };
    }
  }

/////////////////////////////////////////////////////////
async deletePB(params) {
  console.log("Received parameters: ", params);

  const { delete_pb } = params;

  // SQL queries for manual deletions
  const deleteGasGiantQuery = `
      DELETE FROM Gas_giant gg
      WHERE gg.gas_name = :delete_pb
  `;
  const deleteIceGiantQuery = `
      DELETE FROM Ice_giant ig
      WHERE ig.ice_name = :delete_pb
  `;
  const deleteTerrestrialPlanetQuery = `
      DELETE FROM Terrestrial_planet tp
      WHERE tp.tp_name = :delete_pb
  `;
  const deleteMoonQuery = `
      DELETE FROM Moon m
      WHERE m.planetary_body_name = :delete_pb
  `;
  const deletePBQuery = `
      DELETE FROM Planetary_body pb
      WHERE pb.pb_name = :delete_pb
  `;

  try {
      const success = await this.withConnection(async (connection) => {
          console.log("Established database connection.");

          // Delete related rows in Gas_giant
          console.log("Deleting related rows in Gas_giant...");
          const gasGiantResult = await connection.execute(deleteGasGiantQuery, { delete_pb });
          console.log(`Deleted ${gasGiantResult.rowsAffected} rows from Gas_giant.`);

          // Delete related rows in Ice_giant
          console.log("Deleting related rows in Ice_giant...");
          const iceGiantResult = await connection.execute(deleteIceGiantQuery, { delete_pb });
          console.log(`Deleted ${iceGiantResult.rowsAffected} rows from Ice_giant.`);

          // Delete related rows in Terrestrial_planet
          console.log("Deleting related rows in Terrestrial_planet...");
          const terrestrialPlanetResult = await connection.execute(deleteTerrestrialPlanetQuery, { delete_pb });
          console.log(`Deleted ${terrestrialPlanetResult.rowsAffected} rows from Terrestrial_planet.`);

          // Delete related rows in Moon
          console.log("Deleting related rows in Moon...");
          const moonResult = await connection.execute(deleteMoonQuery, { delete_pb });
          console.log(`Deleted ${moonResult.rowsAffected} rows from Moon.`);

          // Delete the row in Planetary_body
          console.log("Deleting row in Planetary_body...");
          const pbResult = await connection.execute(deletePBQuery, { delete_pb });
          console.log(`Deleted ${pbResult.rowsAffected} row(s) from Planetary_body.`);

          // Commit the transaction
          console.log("Committing transaction...");
          await connection.commit();

          return pbResult.rowsAffected > 0;
      });

      if (success) {
          console.log("Deletion successful.");
          return { result: 'Planetary body and all related records deleted successfully.' };
      } else {
          console.error("Deletion failed: No rows were affected.");
          return { error: 'Deletion failed. No matching planetary body found.' };
      }
  } catch (err) {
      console.error("Database operation failed with error:", err);
      return { error: 'Deletion failed. Check server logs for details.' };
  }
}


async updateMoon(params) {
  console.log("Received parameters: ", params);

  // Extract parameters from input
  const { planetary_body_name, moon_name, m_surface_temperature, mass, diameter } = params;

  console.log("Extracted values - Planetary Body Name:", planetary_body_name, "Moon Name:", moon_name, 
              "Surface Temperature:", m_surface_temperature, "Mass:", mass, "Diameter:", diameter);

  // Ensure required identifiers are provided
  if (!planetary_body_name || !moon_name) {
      console.error("Validation failed: Missing required identifiers.");
      return { error: 'Invalid input: planetary_body_name and moon_name are required.' };
  }

  // Ensure at least one field to update is provided
  if (!m_surface_temperature && !mass && !diameter) {
      console.error("Validation failed: No fields to update.");
      return { error: 'Invalid input: At least one of m_surface_temperature, mass, or diameter must be provided.' };
  }

  // Build the SQL update query dynamically based on provided fields
  const updateFields = [];
  if (m_surface_temperature !== undefined) updateFields.push("m_surface_temperature = :m_surface_temperature");
  if (mass !== undefined) updateFields.push("mass = :mass");
  if (diameter !== undefined) updateFields.push("diameter = :diameter");

  const sqlQuery = `
      UPDATE Moon
      SET ${updateFields.join(", ")}
      WHERE planetary_body_name = :planetary_body_name AND moon_name = :moon_name
  `;
  console.log("SQL Query to be executed:", sqlQuery);

  try {
      // Execute the query using your database connection
      const success = await this.withConnection(async (connection) => {
          console.log("Established database connection.");
          const result = await connection.execute(sqlQuery, {
              planetary_body_name,
              moon_name,
              m_surface_temperature,
              mass,
              diameter,
          }, { autoCommit: true });
          console.log("SQL Execution Result:", result);
          return result.rowsAffected > 0;
      });

      if (success) {
          console.log("Update successful.");
          return { result: 'Tuple successfully updated in Moon table.' };
      } else {
          console.error("Update failed: No rows were affected.");
          return { error: 'Update failed. No matching moon found.' };
      }
  } catch (err) {
      console.error("Database operation failed with error:", err);
      return { error: 'Update failed. Check constraints and input values.' };
  }
}

}

const appService = new AppService();
appService.Initialize();
module.exports = appService;