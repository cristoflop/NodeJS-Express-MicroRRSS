"use strict"

const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const config = require("../config.js");

const DAOUsers = require("../public/js/daoUsers.js")
const DAOImagenes = require("../public/js/daoImagenes.js");
const DAONotificaciones = require("../public/js/daoNotificaciones");
const pool = mysql.createPool(config.mysqlConfig);
const daoUser = new DAOUsers(pool);
const daoImagenes = new DAOImagenes(pool);
const daoNotificaciones = new DAONotificaciones(pool);



const validator = require("validator")


function perfil(request, response) {
    let usr = request.params.id ? request.params.id : request.session.userId;
    daoUser.read(usr, function(error, usuario) {
        if (error) {
            response.redirect("/login");
        } else {
            if (usuario) {
                // render del perfil
                let anyos = null;
                let textoAnyos = " año"
                if (usuario.nacimiento !== null) {
                    let ageDifMs = Date.now() - usuario.nacimiento.getTime();
                    let ageDate = new Date(ageDifMs);
                    anyos = Math.abs(ageDate.getUTCFullYear() - 1970);
                    if (anyos != 1) textoAnyos = " años"
                }
                daoImagenes.read(usr, function(error, imagenes, descripciones) {
                    if (error) {
                        next(error);
                    } else {
                        daoUser.readInfoExtra(usr, function(fallo, extra) {
                            if (fallo) {
                                next(fallo);
                            } else {
                                let notifs = [];
                                if (usr == request.session.userId) {
                                    daoNotificaciones.readNotifsById(usr, function(error2, rows) {
                                        if (error2) {
                                            next(error2);
                                        } else {
                                            daoNotificaciones.readNotificacion(rows, function(error3, lineas) {
                                                if (error3) {
                                                    next(error3);
                                                    //console.log(error3)
                                                } else {
                                                    response.status(200);
                                                    response.render("perfil", {
                                                        logeadoId: request.session.userId,
                                                        otroUserId: usr,
                                                        full_name: usuario.full_name,
                                                        sexo: usuario.sexo,
                                                        nacimiento: usuario.nacimiento ? anyos + textoAnyos : usuario.nacimiento,
                                                        img: usuario.img,
                                                        points: usuario.puntos,
                                                        imagenes: imagenes,
                                                        descripciones: descripciones,
                                                        notifs: lineas,
                                                        errorMsg: null,
                                                        extra: extra
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    response.status(200);
                                    response.render("perfil", {
                                        logeadoId: request.session.userId,
                                        otroUserId: usr,
                                        full_name: usuario.full_name,
                                        sexo: usuario.sexo,
                                        nacimiento: usuario.nacimiento ? anyos + textoAnyos : usuario.nacimiento,
                                        img: usuario.img,
                                        points: usuario.puntos,
                                        imagenes: imagenes,
                                        descripciones: descripciones,
                                        notifs: notifs,
                                        errorMsg: null,
                                        extra: extra
                                    });
                                }
                            }
                        })
                    }
                })
            } else {
                response.redirect("/login");
            }
        }
    });
}


function logOut(request, response) {
    //response.clearCookie("userId");
    request.session.destroy();
    response.redirect("/login");
}


function getImagen(request, response) {
    let pathImg = path.join(__dirname + "/../", "uploads", request.params.id);
    response.sendFile(pathImg);
}


function amigos(request, response) {
    daoUser.getAmigos(request.session.userId, function(error, amis) {
        if (error) {
            next(error)
        } else {
            response.status(200);
            response.render("amigos", {
                img: request.session.img,
                points: request.session.puntos,
                pendientes: amis.pendientes,
                amigos: amis.amigos
            });
        }
    });
}


function aceptarAmigo(request, response) {
    let miId = request.session.userId;
    let otherId = request.params.id;
    daoUser.addAmigo(miId, otherId, function(error) {
        if (error) {
            next(error);
        } else {
            response.redirect("/amigos");
        }
    });
}


function rechazarAmigo(request, response) {
    let miId = request.session.userId;
    let otherId = request.params.id;
    daoUser.deleteAmigo(miId, otherId, function(error) {
        if (error) {
            next(error);
        } else {
            response.redirect("/amigos");
        }
    });
}


function modificarPerfilGET(request, response) {
    daoUser.read(request.session.userId, function(error, usuario) {
        if (error) {
            next(error)
        } else {
            var fechaNacimiento = usuario.nacimiento ? usuario.nacimiento.toISOString().slice(0, 10) : usuario.nacimiento;
            response.status(200);
            response.render("modificarPerfil", {
                email: usuario.email,
                full_name: usuario.full_name,
                sexo: usuario.sexo,
                nacimiento: usuario.nacimiento ? fechaNacimiento : usuario.nacimiento,
                img: usuario.img,
                points: usuario.puntos,
                errorMsg: null
            });
        }
    });
}


function modificarPerfilPOST(request, response) {
    let nacimiento = request.body.fecha_nacimiento == '' ? null : request.body.fecha_nacimiento;
    if (nacimiento !== null) nacimiento = nacimiento.replace(/-/g, "/");
    let img = request.file ? request.file.filename : null;
    if (validator.isEmail(request.body.name)) {
        if (validator.isAlphanumeric(request.body.pass)) {
            if (!nacimiento || (validator.isBefore(nacimiento))) {
                daoUser.update(request.body.name, request.body.pass, request.body.full_name, request.body.sexo, nacimiento, img, request.session.userId, function(error) {
                    if (error) {
                        response.status(200);
                        response.render("modificarPerfil", {
                            email: request.body.name,
                            full_name: request.body.full_name,
                            sexo: request.body.sexo,
                            nacimiento: request.body.fecha_nacimiento,
                            img: img,
                            points: request.body.puntos,
                            errorMsg: error.message
                        });
                    } else {
                        request.session.img = img;
                        response.redirect("/perfil")
                    }
                });
            } else {
                response.status(200);
                response.render("modificarPerfil", {
                    email: request.body.name,
                    full_name: request.body.full_name,
                    sexo: request.body.sexo,
                    nacimiento: request.body.fecha_nacimiento,
                    img: img,
                    points: request.body.puntos,
                    errorMsg: "La fecha introducida no es valida"
                })
            }
        } else {
            response.status(200);
            response.render("modificarPerfil", {
                email: request.body.name,
                full_name: request.body.full_name,
                sexo: request.body.sexo,
                nacimiento: request.body.fecha_nacimiento,
                img: img,
                points: request.body.puntos,
                errorMsg: "La contraseña introducida debe ser alfanumerica"
            })
        }
    } else {
        response.status(200);
        response.render("modificarPerfil", {
            email: request.body.name,
            full_name: request.body.full_name,
            sexo: request.body.sexo,
            nacimiento: request.body.fecha_nacimiento,
            img: img,
            points: request.body.puntos,
            errorMsg: "El email introducido no tiene formato valido"
        })
    }
}


function search(request, response) {
    let name = request.body.nombre;
    if (name == "") {
        response.redirect("amigos")
    } else {
        daoUser.readByName(name, request.session.userId, function(error, users) {
            if (error) {
                next(error);
            } else {
                response.status(200);
                response.render("search", {
                    busqueda: name,
                    img: request.session.img,
                    points: request.session.puntos,
                    users: users
                });
            }
        });
    }
}


function solicitar(request, response) {
    if (request.session.userId == request.params.id) {
        response.redirect("/amigos");
    } else {
        daoUser.isUserFriend(request.session.userId, request.params.id, function(error, amistad) {
            if (error) {
                next(error);
            } else {
                if (amistad) {
                    response.redirect("/amigos")
                } else {
                    daoUser.solicitar(request.session.userId, request.params.id, function(error2) {
                        if (error2) {
                            next(error2);
                        } else {
                            response.redirect("/amigos");
                        }
                    });
                }
            }
        });
    }
}


module.exports = {
    perfil: perfil,
    getImagen: getImagen,
    logOut: logOut,
    amigos: amigos,
    aceptarAmigo: aceptarAmigo,
    rechazarAmigo: rechazarAmigo,
    modificarPerfilGET: modificarPerfilGET,
    modificarPerfilPOST: modificarPerfilPOST,
    search: search,
    solicitar: solicitar
}