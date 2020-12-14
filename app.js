"use strict"

const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

//const mysql = require("mysql");

const config = require("./config.js");

const ficherosEstaticos = path.join(__dirname, "public")

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//const multer = require("multer");
//const multerFactory = multer({ dest: path.join(__dirname, "uploads") });
//const multerFactory = multer({ storage: multer.memoryStorage() });

const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(ficherosEstaticos))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});
app.use(middlewareSession);

const loginregisterRouter = require("./routers/loginregisterRouter.js");
const usuarioRouter = require("./routers/usuarioRouter.js");
const preguntasRespuestasRouter = require("./routers/preguntasRespuestasRouter.js");
const imagenesRouter = require("./routers/imagenesRouter.js");
const notifsRouter = require("./routers/notifsRouter.js");

/*******************************************************************************************************************/

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(ficherosEstaticos))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/*******************************************************************************************************************/


app.use("/", loginregisterRouter);
app.use("/", usuarioRouter);
app.use("/", preguntasRespuestasRouter);
app.use("/", imagenesRouter);
app.use("/", notifsRouter);


/*******************************************************************************************************************/

// Cadena de middlewares
app.use(middlewareNotFoundError);
app.use(middlewareServerError);

function middlewareNotFoundError(request, response) {
    response.status(404);
    // envío de página 404
    response.render("notFound.ejs", {
        url: request.url
    });
}


function middlewareServerError(error, request, response, next) {
    response.status(500);
    // envío de página 500
    response.render("error500.ejs", {
        mensaje: error.message,
        pila: error.stack
    });
    response.end()
}


// Arranque del servior (listen)
app.listen(config.port, function(err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log("Servidor arrancado en el puerto " + config.port);
    }
});