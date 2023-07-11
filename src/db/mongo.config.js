import { connect } from "mongoose";
import config from "../config/config.js";

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
    await connect(configConnection.url, configConnection.options);
    console.log(`=======================CONNECCION MONGO======================`);
    console.log(`======= URL: ${configConnection.url.substring(0, 20)} =======`);
    console.log(`=============================================================`);
  } catch (err) {
    console.log("🚀 ~ file: mongo.config.js:21 ~ mongoDBConnection ~ err:", err);
  }
};
