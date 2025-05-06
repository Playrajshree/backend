const dotenvFlow = require('dotenv-flow');

dotenvFlow.config();

const { PORT, DB_URI, SALT_ROUND, PRIV_KEY, CERT_KEY, CLOUD_NAME,CLOUD_API_KEY,CLOUD_API_SECRET } = process.env;

const Config = {
  PORT,
  DB_URI,
  SALT_ROUND,
  PRIV_KEY,
  CERT_KEY,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET
};

module.exports = Config;
