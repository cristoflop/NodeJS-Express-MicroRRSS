"use strict"

const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const config = require("../config.js");

const DAOUsers = require("../public/js/daoUsers.js")
const pool = mysql.createPool(config.mysqlConfig);
const daoUser = new DAOUsers(pool);

const validator = require("validator");



function loginPOST(request, response) {
    daoUser.isUserCorrect(request.body.name, request.body.pass, function(error, usuario) {
        if (error) {
            response.status(200);
            response.render("login", { errorMsg: "Error" });
        } else {
            if (usuario) {
                request.session.userId = usuario.id;
                request.session.img = usuario.img;
                request.session.puntos = usuario.puntos;
                response.redirect("perfil")
            } else {
                response.status(200);
                response.render("login", { errorMsg: "Usuario o contraseña incorrectos" });
            }
        }
    });
}


function loginGET(request, response) {
    response.status(200);
    response.render("login", { errorMsg: null });
}


function registerGET(request, response) {
    response.status(200);
    response.render("newUser", { errorMsg: null })

}


function registerPOST(request, response) {
    let nacimiento = request.body.fecha_nacimiento == '' ? null : request.body.fecha_nacimiento;
    if (nacimiento !== null) nacimiento = nacimiento.replace(/-/g, "/");
    let img = request.file ? request.file.filename : null;

    if (validator.isEmail(request.body.name)) {
        if (validator.isAlphanumeric(request.body.pass)) {
            if (!nacimiento || (validator.isBefore(nacimiento))) {

                daoUser.addUser(request.body.name, request.body.pass,
                    request.body.full_name, request.body.sexo, nacimiento, img,
                    function(error, data) {
                        if (error) {
                            response.status(200);
                            response.render("newUser", { errorMsg: error.message })
                        } else {
                            //response.cookie("userId", id)
                            request.session.userId = data.id;
                            request.session.img = data.img;
                            request.session.puntos = data.puntos;
                            response.redirect("/perfil");
                        }
                    });

            } else {
                response.status(200);
                response.render("newUser", { errorMsg: "La fecha introducida no es valida" })
            }
        } else {
            response.status(200);
            response.render("newUser", { errorMsg: "La contraseña introducida debe ser alfanumerica" })
        }
    } else {
        response.status(200);
        response.render("newUser", { errorMsg: "El email introducido no tiene formato valido" })
    }
}


function middlewareControlAcceso(request, response, next) {
    if (request.url == "/login" || request.url == "/registrar") {
        if (request.session.userId !== undefined) {
            response.redirect("/perfil");
        } else {
            next();
        }
    } else {
        if (request.session.userId !== undefined) {
            //response.locals.userEmail = request.session.currentUser;
            next();
        } else {
            response.redirect("/login");
        }
    }
}


module.exports = {
    loginGET: loginGET,
    loginPOST: loginPOST,
    registerGET: registerGET,
    registerPOST: registerPOST,
    middlewareControlAcceso: middlewareControlAcceso
}