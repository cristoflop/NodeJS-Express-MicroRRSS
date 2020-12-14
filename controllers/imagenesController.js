"use strict"

const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const config = require("../config.js");

const DAOImagenes = require("../public/js/daoImagenes.js")
const pool = mysql.createPool(config.mysqlConfig);
const daoImagenes = new DAOImagenes(pool);

const validator = require("validator");


function subirImagenPOST(request, response) {
    let img = request.file ? request.file.filename : null;
    if (img != null) {
        if (request.session.puntos >= 100) {
            daoImagenes.addImage(request.session.userId, img, request.body.descripcion, function(error) {
                if (error) {
                    next(error);
                    //console.log(error)
                } else {
                    request.session.puntos = request.session.puntos - 100;
                    response.redirect("/perfil");
                }
            });
        } else { // no tiene puntos suficientes
            response.status(200);
            response.render("perfil", {
                logeadoId: request.session.userId,
                img: request.session.img,
                points: request.session.puntos,
                otroUserId: parseInt(request.body.otroUserId),
                full_name: request.body.full_name,
                sexo: request.body.sexo,
                nacimiento: request.body.nacimiento,
                imagenes: request.body.imagenes ? request.body.imagenes.split(",") : [],
                descripciones: request.body.descripcion ? request.body.descripciones.split(",") : [],
                notifs: [],
                errorMsg: "No tienes puntos suficientes"
            });
        }
    } else {
        response.redirect("/perfil");
    }
}


module.exports = {
    subirImagenPOST: subirImagenPOST
}