const express = require('express');
const service = require('../service/service');
const router = express.Router();
const fs = require('fs');

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500
};

// prevents funny business by only allowing alphabetical, numeric, and specific chars, and checks types
function transformAndCheckParams(parameterValues, parameterFormats) {
  let params = {};
  let meta = {};
  let replace = [];
  for (let p in parameterValues) {
    const value = parameterValues[p];
    const format = parameterFormats[p];
    if (format.type === 'set') {
      for (let gen in format.generate) {
        replace.push([ `:${gen}`, new Array(value.length).fill(0).map((_, i) => {
          let str = format.generate[gen].element;
          for (let sub in format.componentParameters) {
            str = str.replace(new RegExp(`:${sub}`, 'g'), `:${sub}${i}`);
          }
          return str;
        }).join(format.generate[gen].join) ]);
      }
      let n = 0;
      for (let v of value) {
        const result = transformAndCheckParams(v, format.componentParameters);
        if (result.error) return { error: result.error };
        for (let param in result.params) {
          replace.push([ `:${param}${n}`, result.params[param] ]);
        }
        n++;
      }
      continue;
    }

    let map = params;
    if (format.meta) map = meta;
    else map = params;
    if (value === '') return { error: 'Missing value ' + format.display + '.' };
    const match = value.match(/[A-Za-z0-9_+-.* ><=!]+/g);
    if (!match[0] || match[0].length !== value.length) return { error: 'Invalid symbol in ' + format.display + '.' };
    if (format.type === 'number') {
      map[p] = +value;
      if (isNaN(map[p])) return { error: 'Parameter ' + format.display + 'must be numerical!' };
    } else {
      map[p] = value;
    }
  }
  return { params: params, meta: meta, replace: replace };
}

router.get('/check-db-connection', async (_req, res) => {
  const connected = await service.isConnected();
  res.status(STATUS.OK).json({ result: connected });
});

router.post('/initialize', async (_req, res) => {
  const result = await service.initializeTables();
  if (result) {
    res.status(STATUS.OK).json({ result: true });
  } else {
    res.status(STATUS.INTERNAL_ERROR).json({ error: 'Initialization failed!' });
  }
});

router.get('/table/:id', async (req, res) => {
  const data = await service.fetchTable(req.params.id);
  if (data.length > 1) {
    res.status(STATUS.OK).json({ result: data });
  } else {
    res.status(STATUS.INTERNAL_ERROR).json({ error: 'Could not obtain table data!' });
  }
});

router.get('/tables-joined/:ids', async (req, res) => {
  const data = await service.fetchJoined(req.params.ids.split(';'));
  if (!data.error) {
    res.status(STATUS.OK).json({ result: data });
  } else {
    res.status(STATUS.INTERNAL_ERROR).json({ error: 'Could not obtain table data!' });
  }
});

router.get('/table-info/:id', async (req, res) => {
  const data = await service.getTableData(req.params.id);
  if (data.length > 0) {
    res.status(STATUS.OK).json({ result: data });
  } else {
    res.status(STATUS.INTERNAL_ERROR).json({ error: 'Could not obtain table information!' });
  }
});

router.get('/query/:id/:parameters', async (req, res) => {
  let params, meta, replace, transformedParams;
  const json = JSON.parse(fs.readFileSync(__dirname + '/../../sql/query/default/' + req.params.id + '.json').toString());
  if (json.redirect) {
    try {
      const data = await service[json.redirect](JSON.parse(req.params.parameters));
      if (data.error) {
        return res.status(STATUS.BAD_REQUEST).json({ error: data.error });
      }
      return res.status(STATUS.OK).json({ result: data.result });
    } catch(err) {
      console.error(err);
      return res.status(STATUS.BAD_REQUEST).json({ error: 'Invalid inputs.' });
    }
  }
  let sql = fs.readFileSync(__dirname + '/../../sql/query/default/' + req.params.id + '.sql').toString();
  try {
    transformedParams = transformAndCheckParams(JSON.parse(req.params.parameters), json.parameters);
    params = transformedParams.params;
    meta = transformedParams.meta;
    replace = transformedParams.replace;
  } catch(err) {
    console.error(err);
    res.status(STATUS.BAD_REQUEST).json({ error: 'Invalid inputs. Make sure you are only using alphabetical, numerical, or "_+-.><!=" characters.' });
    return;
  }
  if (transformedParams.error) {
    return res.status(STATUS.BAD_REQUEST).json({ error: transformedParams.error });
  }
  for (const r of replace) {
    sql = sql.replace(new RegExp(`${r[0]}`, 'g'), r[1]);
  }
  for (const m in meta) {
    sql = sql.replace(new RegExp(`\:${m}`, 'g'), meta[m]);
  }
  const data = await service.performPremadeQuery(sql, params);
  if (data.error) {
    return res.status(STATUS.INTERNAL_ERROR).json({ error: data.error });
  }
  if (data.result.length > 0) {
    res.status(STATUS.OK).json({ result: data.result });
  } else {
    res.status(STATUS.BAD_REQUEST).json({ error: 'Empty table.' });
  }
});

module.exports = router;