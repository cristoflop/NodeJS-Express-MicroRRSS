"use strict"

const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const config = require("../config.js");

const DAOPreguntas = require("../public/js/daoPreguntas.js")
const pool = mysql.createPool(config.mysqlConfig);
const daoPreguntas = new DAOPreguntas(pool);

const DAONotificaciones = require("../public/js/daoNotificaciones");
const daoNotificaciones = new DAONotificaciones(pool);

const validator = require("validator");


function muestraPreguntasGET(request, response) {
    daoPreguntas.readRandomQuestions(request.session.userId, 5, function(error, preguntas) {
        if (error) {
            next(error);
        } else {
            response.status(200);
            response.render("mostrarPreguntas", {
                img: request.session.img,
                points: request.session.puntos,
                preguntas: preguntas
            });
        }
    });
}


function creaPreguntaGET(request, response) {
    response.status(200);
    response.render("creaPregunta", {
        img: request.session.img,
        points: request.session.puntos,
        errorMsg: null
    });
}


function creaPreguntaPOST(request, response) {
    let respuestasAux = [request.body.textoRespuestaUno, request.body.textoRespuestaDos];
    if (request.body.textoRespuestaTres !== undefined && request.body.textoRespuestaTres !== "")
        respuestasAux.push(request.body.textoRespuestaTres);
    if (request.body.textoRespuestaCuatro !== undefined && request.body.textoRespuestaCuatro !== "")
        respuestasAux.push(request.body.textoRespuestaCuatro);

    let respuestas = new Set(respuestasAux);

    daoPreguntas.createQuestion(request.session.userId, request.body.textoPregunta, respuestas, function(error) {
        if (error) {
            next(error);
        } else {
            response.redirect("/preguntas");
        }
    });
}


/************************************************************************************************************/


function preguntaSeleccionadaGET(request, response) {
    daoPreguntas.questionSelected(request.params.id, request.session.userId, function(error, result) {
        if (error) {
            next(error);
        } else {
            daoPreguntas.amigosQueHanRespondido(request.session.userId, result.id, function(error, amigos) {
                if (error) {
                    next(error);
                } else {
                    response.status(200);
                    response.render("preguntaContestar", {
                        img: request.session.img,
                        points: request.session.puntos,
                        texto: result.texto,
                        id: result.id,
                        respondida: result.respondida,
                        amigos: amigos
                    });
                }
            })
        }
    });
}


/**********************************************************************************************************************/

function preguntaContestarYoMismoGET(request, response) {
    daoPreguntas.readQuestionById(request.params.id, function(error, pregunta, respuestas, id) {
        if (error) {
            next(error);
        } else {
            daoPreguntas.heRespondido(request.session.userId, request.params.id, function(error2, heRespondido) {
                if (error2) {
                    next(error)
                } else {
                    if (heRespondido) {
                        response.redirect("/pregunta/" + request.params.id)
                    } else {
                        response.status(200);
                        response.render("responderPregYoMismo", {
                            img: request.session.img,
                            points: request.session.puntos,
                            pregunta: pregunta,
                            respuestas: respuestas,
                            id: id,
                            errorMsg: null
                        });
                    }
                }
            })
        }
    });
}


function responderPOST(request, response) {
    let idPreg = parseInt(request.body.idP);
    if (request.body.opcion == "otro") {
        if (request.body.respuestaPropia == '') {
            let respuestas = request.body.listaRespuestas.split(",");
            response.status(200);
            response.render("responderPregYoMismo", {
                img: request.session.img,
                points: request.session.puntos,
                pregunta: request.body.tituloPregunta,
                respuestas: respuestas,
                id: idPreg,
                errorMsg: "No has escrito tu respuesta"
            });
        } else {
            daoPreguntas.addAnswerForMe(request.session.userId, idPreg, request.body.respuestaPropia, function(error) {
                if (error) {
                    next(error)
                } else {
                    response.redirect("/preguntas");
                }
            })
        }
    } else {
        daoPreguntas.addAnswerForMe(request.session.userId, idPreg, request.body.opcion, function(error) {
            if (error) {
                next(error)
            } else {
                response.redirect("/preguntas");
            }
        })
    }
}


/**********************************************************************************************************************/


function responderPorOtro(request, response) {
    let preg = request.body.idPreg;
    let otherId = request.body.idUser;
    daoPreguntas.getRespuestasDeOtro(otherId, preg, function(error, pregunta, respuestas) {
        if (error) {
            next(error);
        } else {
            response.status(200);
            response.render("responderPregAmigo", {
                img: request.session.img,
                points: request.session.puntos,
                pregunta: pregunta,
                respuestas: Array.from(respuestas),
                userId: otherId,
                errorMsg: null
            });
        }
    });
}


function respondidaPorOtro(request, response) {
    let pregunta = request.body.idPreg;
    let otherId = request.body.userId;
    let miId = request.session.userId;
    let respuesta = request.body.respuesta;
    if (respuesta !== undefined) {
        daoPreguntas.addAnswerForOther(miId, otherId, pregunta, respuesta, function(error, result) {
            if (error) {
                next(error);
            } else {
                daoNotificaciones.addNotificacion(otherId, miId, pregunta, function(error, rows) {
                    if (error) {
                        next(error);
                    } else {
                        if (result == "acierto") request.session.puntos = request.session.puntos + 50;
                        response.redirect("/preguntas");
                    }
                })
            }
        });
    } else {
        let respuestas = request.body.listaRespuestas.split(",");
        response.status(200);
        response.render("responderPregAmigo", {
            img: request.session.img,
            points: request.session.puntos,
            pregunta: { id: pregunta, textoP: request.body.textoP },
            respuestas: respuestas,
            userId: otherId,
            errorMsg: "No has seleccionado ninguna respuesta"
        });
    }
}



module.exports = {
    muestraPreguntasGET: muestraPreguntasGET,
    creaPreguntaGET: creaPreguntaGET,
    creaPreguntaPOST: creaPreguntaPOST,
    preguntaSeleccionadaGET: preguntaSeleccionadaGET,
    preguntaContestarYoMismoGET: preguntaContestarYoMismoGET,
    responderPOST: responderPOST,
    responderPorOtro: responderPorOtro,
    respondidaPorOtro: respondidaPorOtro
}