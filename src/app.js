import express from "express";
import passport from "passport";
import handlebars from "express-handlebars";
import displayRoutes from "express-routemap";
import MongoStore from "connect-mongo";
import cors from "cors";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { mongoDBConnection } from "./db/mongo.config.js";
import config from "./config/config.js";
import MessagesManagerDao from "./dao/managers/messagesManager.managers.js";
import session from "express-session";
import initializePassport from "./config/passport.config.js";

const { API_VERSION, CURSO, PORT, NODE_ENV, SIGNING_SECRET, DB_CNN, DB_NAME } = config;

export default class App {
  app;
  env;
  port;
  server;
  apiRoutes;
  viewRoutes;
  messagesManager;

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
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl: DB_CNN,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
          ttl: 60 * 15, //15 minutos
          dbName: DB_NAME,
        }),
        secret: SIGNING_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );
    initializePassport();
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  initializeRoutes(apiRoutes, viewRoutes) {
    apiRoutes.forEach((route) => {
      this.app.use(`/api/${API_VERSION}`, route.router);
    });
    viewRoutes.forEach((route) => {
      this.app.use(`/`, route.router);
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
      console.log(`=================================`);
      console.log(`======= COURSE: ${CURSO} ======`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`=================================`);
    });

    this.initializeWebChat(server);
    this.initializeRoutes(this.apiRoutes, this.viewRoutes);
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
    this.app.use(
      session({
        secret: "coderSecret",
        resave: true,
        saveUninitialized: true,
      })
    );
  }
}
