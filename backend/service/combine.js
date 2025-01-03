const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../../sql/initialize');

(async () => {
  try {
    console.log('Combining table creation sql scripts...');
    let combined = [];
    // drop tables
    const data = fs.readFileSync(path.join(dir, 'drop', 'drop.sql'));
    combined.push(data.toString());
    // create table
    const createFiles = fs.readdirSync(path.join(dir, 'create'));
    for (let file of createFiles) {
      const data = fs.readFileSync(path.join(dir, 'create', file));
      combined.push(data.toString());
    }
    // insert
    const insertFiles = fs.readdirSync(path.join(dir, 'insert'));
    for (let file of insertFiles) {
      const read = fs.readFileSync(path.join(dir, 'insert', file));
      const data = JSON.parse(read.toString());
      for (let row of data.rows) {
        let str = data.insert;
        for (let value of row) {
          str = str.replace(/:[^,)]+/, typeof value === 'number' ? value : value === null ? null : `'${value}'`);
        }
        str += ';';
        combined.push(str);
      }
    }
    // create alter table
    const alterFiles = fs.readdirSync(path.join(dir, 'alter'));
    for (let file of alterFiles) {
      const data = fs.readFileSync(path.join(dir, 'alter', file));
      combined.push(data.toString());
    }

    // combined = combined.map(c => c.replace(/;/g, ''));
    combined = combined.join('\n--split\n');
    combined = combined.replace(/\-\-split\n/g, '\n');
    // combined = `BEGIN\n${combined}\nEND;`;
    fs.writeFileSync(path.join(dir, 'combined.sql'), combined);
    console.log('Combined!');
  } catch(err) {
    console.error(err);
  }
})();