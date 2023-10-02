<h1>Welcome to Vehicles Ecommerce</h1>
<p align="center">
<img src="https://github.com/AndreaPennisi04/entregables/assets/113997811/3879ee3e-e58e-49ce-abc8-3da505430120"  width="700" height="500">
</p>
<br>

## Project description

The site is a imaginary brand site to sell vehicles though a portal in a eCommerce way. The project was created as part of a training course for the technologies mentioned below.

## Project status

The project is finished and tested but never used in a live customer facing environment

## Delivery

The project is ready to be deployed as a docker container but it needs a mongoDb instance running somewhere. In my case I am using MongoDb Atlas

## Demo

https://entregables-production.up.railway.app/login

## Used technologies

- <a href="#"><img alt="Javascript" src="https://img.shields.io/badge/Javascript%20-%23FF5100.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="NodeJS" src="https://img.shields.io/badge/NodeJS%20-%2308000.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB%20-%230000FF.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="express" src="https://img.shields.io/badge/express%20-%23FF0000.svg?logo=express&logoColor=white"></a>
- <a href="#"><img alt="JWT" src="https://img.shields.io/badge/JWT%20-%23Fr5000.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="Docker" src="https://img.shields.io/badge/Docker%20-%23FFFF00.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="Handlebars" src="https://img.shields.io/badge/Hnadlebars%20-%23FF8789.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="Mongoose" src="https://img.shields.io/badge/Mongoose%20-%2300FFFF.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="Nodemailer" src="https://img.shields.io/badge/Nodemailer%20-%23FFFFF0.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="Swagger" src="https://img.shields.io/badge/Swagger%20-%23FF00FF.svg?logo=JWT&logoColor=blue"></a>
- <a href="#"><img alt="Stripe" src="https://img.shields.io/badge/Stripe%20-%23C0C0C0.svg?logo=JWT&logoColor=blue"></a>

## Some specific subjects that are covered in the project

- Callbacks, Funciones JS, Promesas, Sincronismo y Asincronismo, Archivos sincronicos, File system, Promesas
- Paquetes NPM: Node js, NPM
- Servidores web: Servidores con express JS y Objeto request
- Express avanzado, Router y Multer: express router, express, Middleware y Multer
- Motores de plantillas y Handlebars, Websocket, Socket en express con socket.io, chat con websocket
- MongoDB (CRUD en MongoDB). Mongoose, DBaas, Mongoose en Node JS
- Mongo Avanzado: indexacion, populacion en Mongo, Aggregation, pagination con mongoose, Cookies, Session y storage, session con mongo Atlas, Login, Autorizacion y autenticacion, Passport, Autenticacion por terceros, Autorizacion para Github, JWT
- Custom router, process, Variable de Entorno, Global y child process, Arquitectura por capas
- Arquitectura del servidor: diseño y persistencia, desarrollo de un servidor express avanzado en capas
- Mailing: nodemailer y twilio
- Testing: Mock , TDD
- Optimizacion: Middleware para manejo de errores
- Versiones y paquetes: Node version manager, Administradores de paquetes, NPM
- Looging y performance: Logger, testing de performance y testing avanzado
- Clusters y escalabilidad: Modulo cluster, Docker, Docker como PM
- Orquestacion: Docker Hub, Orquestacion de contenedores
- Orquestacion con cubernetes y seguridad: OWASP
- Documentacion: Swagger
- Testing Unitario: Mocha y Chai
- Testing Avanzado: Testing de integracion, Testing con super test, Testing de elementos Avanzados
- Frameworks de desarrollo: Nest JS, Conexion de Nest JS a Mongo
- TypeScript
- Autenticacion con JWT
- Product cloud: Configuracion de pipelines en Railway.app
- Pasarelas de pagos: Stripe

## Local setup

You need to create a file called

```console
.env.desarrollo.local
```

Here is an example:

```console
API_VERSION=v1
CURSO=43335
DB_CNN=mongodb+srv://YOURMONGOKEY:YOURMONGOSECRET@cluster55115.tp5oprc.mongodb.net/
DB_NAME=ecommerce
NODE_ENV=desarrollo
PORT=8080
SIGNING_SECRET=YOURSECRET
GITHUB_SECRET=YOURGITHUBSECRET
GITHUB_APP_ID=YOURAPPID
GITHUB_CLIENT_ID=YOURGITHUBCLIENTID
GITHUB_CALLBACK_URL=http://localhost:8080/session/gitHubCallback
API_URL=http://localhost:8080
LOG_LEVEL_CONSOLE=debug
LOG_LEVEL_FILE=error
EMAIL_ADDRESS=pennisicoderhouse@gmail.com
EMAIL_SECRET=xxxxxxxxxxx
STRIPE_KEY=dasdasdasdasdas
```

## Author

<p style="color: red;">Andrea Pennisi</p>
