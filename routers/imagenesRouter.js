"use strict"

const path = require("path");
const multer = require("multer");
const multerFactory = multer({ dest: path.join("", "uploads") });

const express = require("express")
const imagenesRouter = express.Router();
const imagenesController = require("../controllers/imagenesController.js");

imagenesRouter.post("/subirFoto", multerFactory.single("pic"), imagenesController.subirImagenPOST);

module.exports = imagenesRouter;