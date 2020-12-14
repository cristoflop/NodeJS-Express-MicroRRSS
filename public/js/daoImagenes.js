"use strict"

const mysql = require("mysql");

class DAOUsers {

    constructor(poolCon) {
        this.pool = poolCon;
    }

    addImage(usuarioId, img, descripcion, callback) {
        let query = "INSERT INTO imagenesSubidas values (?, ?, ?)";
        let params = [usuarioId, img, descripcion];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        //callback(null);
                        query = "update usuario set points = points - 100 where id = ?";
                        params = [usuarioId];
                        connection.query(query, params, function(error2) {
                            connection.release();
                            if (error2) {
                                callback(new Error("Error en la consulta tres a la bd: "));
                            } else {
                                callback(null)
                            }
                        });
                    }
                });
            }
        });
    }


    read(usuarioId, callback) {
        let query = "SELECT imagen, descripcion FROM imagenessubidas WHERE usuarioId = ?";
        let params = [usuarioId];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        let imagenes = [];
                        let descripciones = [];
                        rows.forEach(element => {
                            imagenes.push(element.imagen);
                            descripciones.push(element.descripcion);
                        });
                        callback(null, imagenes, descripciones)
                    }
                });
                connection.release();
            }
        });
    }


}

module.exports = DAOUsers;