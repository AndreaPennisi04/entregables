import { Router } from "express";

const viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
  res.render("index", { style: "index.css" });
});

viewsRouter.get("/home", async (req, res) => {
  const products = await pm.getProducts();
  res.render("home", { products, style: "home.css" });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await req.productManager.getProducts();
  res.render("realTimeProducts", { products, style: "home.css" });
});

export default viewsRouter;
