import App from "./app.js";
import CartRouter from "./routes/cart.routes.js";
import ProductRouter from "./routes/product.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import SessionRouter from "./routes/session.routes.js";
import BillRouter from "./routes/bill.routes.js";
import UsersRouter from "./routes/users.routes.js";

const app = new App(
  [new CartRouter(), new ProductRouter(), new BillRouter(), new UsersRouter()],
  [new ViewsRouter(), new SessionRouter()]
);

app.listen();
