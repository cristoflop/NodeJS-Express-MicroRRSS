"use strict"

const path = require("path");
const multer = require("multer");
const multerFactory = multer({ dest: path.join("", "uploads") });

const express = require("express")
const preguntasRespuestasRouter = express.Router();
const preguntasRespuestasController = require("../controllers/preguntasRespuestasController.js")

preguntasRespuestasRouter.get("/preguntas", preguntasRespuestasController.muestraPreguntasGET);

preguntasRespuestasRouter.get("/crearPregunta", preguntasRespuestasController.creaPreguntaGET);

preguntasRespuestasRouter.post("/crearPregunta", preguntasRespuestasController.creaPreguntaPOST);

/************************************************************************************************************************/

preguntasRespuestasRouter.get("/pregunta/:id", preguntasRespuestasController.preguntaSeleccionadaGET);

preguntasRespuestasRouter.get("/pregunta/contestaryo/:id", preguntasRespuestasController.preguntaContestarYoMismoGET);

preguntasRespuestasRouter.post("/pregunta/contestaryo/:id", preguntasRespuestasController.responderPOST);

preguntasRespuestasRouter.post("/pregunta/contestarporotro", preguntasRespuestasController.responderPorOtro);

preguntasRespuestasRouter.post("/pregunta/contestadaporotro", preguntasRespuestasController.respondidaPorOtro);

module.exports = preguntasRespuestasRouter;