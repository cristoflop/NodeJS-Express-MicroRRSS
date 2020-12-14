"use strict"

const mysql = require("mysql");

class DAONotificaciones {

    constructor(poolCon) {
        this.pool = poolCon;
    }

    addNotificacion(propietario, responde_por, preguntaId, callback) {
        let query = "INSERT INTO notificaciones values (?, ?, ?)";
        let params = [propietario, responde_por, preguntaId];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        callback(null)
                    }
                });
            }
        });
    }


    readNotifsById(miId, callback) {
        let query = "select propietario, respondido_por, pregunta from notificaciones where propietario = ?"
        let params = [miId];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        //console.log(error)
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        //console.log(rows);
                        callback(null, rows)
                    }
                });
                connection.release();
            }
        });
    }



    /* revisar importante
            SELECT u.id, u.full_name, o.respuesta as respOtro, o.resultado, m.pregunta,
            (select texto from preguntas where id = m.pregunta) as textoPreg, m.respuesta as respYo 
            FROM resp_por_mi m join resp_por_otro o on (m.usuario = o.responde_por)
            join usuario u on (o.usuario = u.id)
            where m.usuario = 3 and m.pregunta = 3 and o.usuario = 1
    */
    readNotificacion(notificaciones, callback) {
        let plantilla = "SELECT u.id, u.full_name, o.respuesta as respOtro, o.resultado, m.pregunta, " +
            "(select texto from preguntas where id = m.pregunta) as textoPreg, m.respuesta as respYo " +
            "FROM resp_por_mi m join resp_por_otro o on (m.usuario = o.responde_por) " +
            "join usuario u on (o.usuario = u.id) " +
            "where m.usuario = ? and m.pregunta = ? and o.usuario = ?";
        let params = [];
        let query = "";
        notificaciones.forEach((x, i) => {
            if (i > 0) query = query + " union ";
            query = query + plantilla;
            params.push(x.propietario);
            params.push(x.pregunta);
            params.push(x.respondido_por);
        });
        if (query.length == 0) {
            callback(null, [])
        } else {
            this.pool.getConnection(function(err, connection) {
                if (err) {
                    callback(new Error("Error de conexion a la bd"))
                } else {
                    connection.query(query, params, function(error, rows) {
                        if (error) {
                            //console.log(error)
                            callback(new Error("Error en la consulta a la bd"));
                        } else {
                            //console.log(rows)
                            callback(null, rows)
                        }
                    });
                    connection.release();
                }
            });
        }
    }


    eliminaNotif(propietario, responde_por, pregunta, callback) {
        let query = "delete from notificaciones where propietario = ? and respondido_por = ? and pregunta = ?";
        let params = [propietario, responde_por, pregunta];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        //console.log(error)
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        //console.log(rows);
                        callback(null)
                    }
                });
                connection.release();
            }
        });
    }


}

module.exports = DAONotificaciones;