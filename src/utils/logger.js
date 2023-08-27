import winston from "winston";
import config from "../config/config.js";

const { LOG_LEVEL_CONSOLE, LOG_LEVEL_FILE } = config;

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "brightRed",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

winston.addColors(customLevelsOptions.colors);

const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL_CONSOLE,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: "./errors.log", level: LOG_LEVEL_FILE }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

export const getLogger = () => {
  return logger;
};
