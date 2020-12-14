"use strict"

const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const config = require("../config.js");

const DAONotificaciones = require("../public/js/daoNotificaciones");
const pool = mysql.createPool(config.mysqlConfig);
const daoNotificaciones = new DAONotificaciones(pool);


function eliminaNotif(request, response) {
    //console.log(request.body)
    daoNotificaciones.eliminaNotif(request.body.propietario, request.body.responde_por, request.body.pregunta, function(error) {
        if (error) {
            next(error);
        } else {
            response.redirect("/perfil")
        }
    });
}


module.exports = {
    eliminaNotif: eliminaNotif
}