"use strict"

const path = require("path");
const multer = require("multer");
const multerFactory = multer({ dest: path.join(__dirname + "/../", "uploads") });

const express = require("express")
const notifsRouter = express.Router();
const notifsController = require("../controllers/notifsController.js")

notifsRouter.post("/eliminaNotif", notifsController.eliminaNotif)

module.exports = notifsRouter;