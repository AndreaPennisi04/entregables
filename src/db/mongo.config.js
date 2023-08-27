import { connect } from "mongoose";
import config from "../config/config.js";
import { getLogger } from "../utils/logger.js";

const { DB_CNN, DB_NAME } = config;

const configConnection = {
  url: `${DB_CNN}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME,
  },
};

export const mongoDBConnection = async () => {
  try {
    const logger = getLogger();
    await connect(configConnection.url, configConnection.options);
    logger.info(`CONNECCION MONGO URL: ${configConnection.url.substring(0, 20)} =======`);
  } catch (err) {
    logger.fatal("🚀 ~ file: mongo.config.js:21 ~ mongoDBConnection ~ err:", err);
  }
};
