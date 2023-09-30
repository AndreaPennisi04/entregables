import express from "express";
import passport from "passport";
import handlebars from "express-handlebars";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import swaggerUiExpress from "swagger-ui-express";
import cors from "cors";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { mongoDBConnection } from "./services/mongo.config.js";
import config from "./config/config.js";
import MessagesManagerDao from "./dao/managers/messagesManager.managers.js";
import initializePassport from "./config/passport.config.js";
import { ErrorHandler } from "./middleware/ErrorHandler.middleware.js";
import { addLogger, getLogger } from "./utils/logger.js";
import swaggerSpecs from "./services/swaggerService.js";
import { addHeaders } from "./middleware/addHeaders.middleware.js";

const { API_VERSION, CURSO, PORT, NODE_ENV } = config;

export default class App {
  app;
  env;
  port;
  server;
  apiRoutes;
  viewRoutes;
  messagesManager;
  logger;

  constructor(apiRoutes, viewRoutes) {
    this.app = express();
    this.port = PORT || 8000;
    this.env = NODE_ENV;
    this.initializeMiddlewares();
    this.apiRoutes = apiRoutes;
    this.viewRoutes = viewRoutes;
    this.connectDB();
    this.initHandlebars();
    this.messagesManager = new MessagesManagerDao();
    this.logger = getLogger();
  }

  getServer() {
    return this.app;
  }

  closeServer(done) {
    this.server = this.app.listen(this.port, () => {
      done();
    });
  }

  async connectDB() {
    await mongoDBConnection();
  }

  initializeMiddlewares() {
    this.app.use(addLogger);
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(addHeaders);
    initializePassport();
    this.app.use(passport.initialize());
  }

  initializeRoutes(apiRoutes, viewRoutes) {
    apiRoutes.forEach((route) => {
      this.app.use(`/api/${API_VERSION}`, route.router);
    });
    viewRoutes.forEach((route) => {
      this.app.use(`/`, route.router);
    });

    this.app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));

    this.app.get(`/loggerTest`, (req, res) => {
      try {
        req.logger.fatal("Testing fatal message");
        req.logger.error("Testing error message");
        req.logger.warning("Testing warning message");
        req.logger.info("Testing info message");
        req.logger.http("Testing http message");
        req.logger.debug("Testing debug message");
        res.send("All logs have been triggered ");
      } catch (error) {
        res.logger.error(error);
      }
    });
  }

  initializeWebChat(server) {
    const io = new Server(server);
    io.on("connection", (socket) => {
      socket.on("authenticated", async (username) => {
        socket.broadcast.emit("newUserConnected", username);
        await this.messagesManager.newMessage({ user: "Server", content: `${username} connected` });
        const messages = await this.messagesManager.getLastMessages(20);
        io.emit("messageLogs", messages);
      });
      socket.on("message", async (message) => {
        await this.messagesManager.newMessage(message);
        const messages = await this.messagesManager.getLastMessages(20);
        io.emit("messageLogs", messages);
      });
    });

    // Make io accessible to our router
    this.app.use(function (req, res, next) {
      req.io = io;
      next();
    });
  }

  listen() {
    const server = this.app.listen(this.port, () => {
      displayRoutes(this.app);
      this.logger.info(`COURSE: ${CURSO}`);
      this.logger.info(`ENV: ${this.env}`);
      this.logger.info(`PORT: ${this.port}`);
    });

    this.initializeWebChat(server);
    this.initializeRoutes(this.apiRoutes, this.viewRoutes);
    this.app.use(ErrorHandler);
  }

  initHandlebars() {
    this.app.engine(
      "handlebars",
      handlebars.engine({
        runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true,
        },
      })
    );
    this.app.set("views", `${__dirname}/views`);
    this.app.set("view engine", "handlebars");
  }
}
