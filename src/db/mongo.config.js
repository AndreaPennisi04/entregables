import { connect } from "mongoose";
import { getBaseConfiguration } from "../config/getBaseConfiguration.js";

const { DB_HOST, DB_PORT, DB_NAME, DB_CNN } = getBaseConfiguration();

const configConnection = {
  url: `${DB_CNN}${DB_NAME}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
