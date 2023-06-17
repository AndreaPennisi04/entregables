const App = require("./app");
const BaseRoute = require("./routes/base.routes.js");
const CartRoute = require("./routes/cart.routes.js");
const ProducttRoute = require("./routes/product.routes.js");
const viewsRouter = require("./routes/views.routes.js");

const app = new App([new BaseRoute(), new CartRoute(), new ProducttRoute(), new viewsRouter()]);

app.listen();
