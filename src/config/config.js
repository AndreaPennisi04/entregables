const { config } = require("dotenv");

config({
  path: `.env.${process.env.NODE_ENV || "development"}, local`,
});

const { API_VERSION, NODE_ENV, PORT, ORIGIN, DB_CNN, DB_HOSTDB_PORT } = process.env;

module.exports = {
  API_VERSION,
  NODE_ENV,
  PORT,
  ORIGIN,
  DB_CNN,
  DB_HOSTDB_PORT,
};
