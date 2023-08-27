import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "desarrollo"}.local`,
});

const {
  API_VERSION,
  PORT,
  DB_CNN,
  DB_NAME,
  CURSO,
  NODE_ENV,
  SIGNING_SECRET,
  GITHUB_SECRET,
  GITHUB_APP_ID,
  GITHUB_CLIENT_ID,
  GITHUB_CALLBACK_URL,
  API_URL,
  LOG_LEVEL_CONSOLE,
  LOG_LEVEL_FILE,
} = process.env;

export default {
  API_VERSION,
  PORT,
  DB_CNN,
  DB_NAME,
  CURSO,
  NODE_ENV,
  SIGNING_SECRET,
  GITHUB_SECRET,
  GITHUB_APP_ID,
  GITHUB_CLIENT_ID,
  GITHUB_CALLBACK_URL,
  API_URL,
  LOG_LEVEL_CONSOLE,
  LOG_LEVEL_FILE,
};
