"use strict"

const path = require("path");
const multer = require("multer");
const multerFactory = multer({ dest: path.join(__dirname + "/../", "uploads") });

const express = require("express")
const usuarioRouter = express.Router();
const usuarioController = require("../controllers/usuarioController.js")


usuarioRouter.get("/perfil", usuarioController.perfil);

usuarioRouter.get("/perfil/:id", usuarioController.perfil);

usuarioRouter.get("/imagen/:id", usuarioController.getImagen);

usuarioRouter.get("/logout", usuarioController.logOut);

usuarioRouter.get("/amigos", usuarioController.amigos);

usuarioRouter.get("/aceptar/:id", usuarioController.aceptarAmigo);

usuarioRouter.get("/rechazar/:id", usuarioController.rechazarAmigo);

usuarioRouter.get("/modificarPerfil", usuarioController.modificarPerfilGET);

usuarioRouter.post("/modificarPerfil", multerFactory.single("pic"), usuarioController.modificarPerfilPOST);

usuarioRouter.post("/search", usuarioController.search);

usuarioRouter.get("/solicitar/:id", usuarioController.solicitar);

module.exports = usuarioRouter;