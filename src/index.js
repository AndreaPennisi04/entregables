import "./config/loadEnv.js";
import App from "./app.js";
import CartRouter from "./routes/cart.routes.js";
import ProductRouter from "./routes/product.routes.js";
import ViewsRouter from "./routes/views.routes.js";

const app = new App([new CartRouter(), new ProductRouter(), new ViewsRouter()]);

app.listen();
