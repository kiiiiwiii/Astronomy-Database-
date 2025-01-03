const express = require('express');
const controller = require('./backend/controller/controller');

const loadEnvFile = require('./backend/utils/envUtil');
const env = loadEnvFile('./.env');

const app = express();
const PORT = env.PORT || 65534;

app.use(express.static('./frontend'));
app.use(express.static('./sql/query'));
app.use(express.json());

app.use('/', controller);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});