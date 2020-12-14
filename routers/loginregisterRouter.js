"use strict"

const path = require("path");
const multer = require("multer");
const multerFactory = multer({ dest: path.join("", "uploads") });
//const multerFactory = multer({ storage: multer.memoryStorage() });

const express = require("express")
const loginRegisterRouter = express.Router();
const loginRegisterController = require("../controllers/loginregisterController.js")



loginRegisterRouter.use(loginRegisterController.middlewareControlAcceso);

loginRegisterRouter.get("/login", loginRegisterController.loginGET);

loginRegisterRouter.post("/login", loginRegisterController.loginPOST);

loginRegisterRouter.get("/registrar", loginRegisterController.registerGET);

loginRegisterRouter.post("/registrar", multerFactory.single("pic"), loginRegisterController.registerPOST);

module.exports = loginRegisterRouter;