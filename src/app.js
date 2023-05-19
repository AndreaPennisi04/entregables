import express from "express";
import productRouter from "./product.js";
import cartRouter from "./cart.js";

const app = express();

app.use(express.json());
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

app.listen(8080, () => {
  console.log("Listening on port 8080. Ready to receive requests");
});
