import express from "express";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./ProductManager.js";

const app = express();
const server = app.listen(8080, () => {
  console.log("Listening on port 8080. Ready to receive requests");
});

//Webchat
const io = new Server(server);
const messages = [];

io.on("connection", (socket) => {
  alert("New user connected");
});

io.on("message", (data) => {
  messages.push(data);
  io.emit("messageLogs", messages);
});

socket.on("autenticated", (data) => {
  socket.emit("messageLogs", messages);
  socket.broadcast.emit("newUserConnected", data);
});

// Make io accessible to our router
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// Make Product Manager accessible to our router
app.use(function (req, res, next) {
  const pm = new ProductManager("./files/products.json");
  req.productManager = pm;
  next();
});

app.use(express.json());
app.engine("handlebars", handlebars.engine());

app.set("views", `${__dirname}/views`);
app.set("view engine", `handlebars`);
app.use(express.static(`${__dirname}/public`));
app.engine("handlebars", handlebars.engine());

app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);
