import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../utils.js";

const swaggerSpecs = swaggerJSDoc({
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce API",
      description: "Con esta api se pueden hacer todo en la app",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: {
      bearerAuth: ["User"],
    },
    servers: [{ url: "http://localhost:8080", description: "This is the local environment" }],
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
});

console.log(JSON.stringify(swaggerSpecs));

export default swaggerSpecs;
