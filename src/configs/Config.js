const dotenvFlow = require('dotenv-flow');

dotenvFlow.config();

const { PORT, DB_URI, SALT_ROUND, PRIV_KEY, CERT_KEY } = process.env;

const Config = {
  PORT,
  DB_URI,
  SALT_ROUND,
  PRIV_KEY,
  CERT_KEY
};

module.exports = Config;
