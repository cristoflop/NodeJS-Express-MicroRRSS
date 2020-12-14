"use strict"

const mysql = require("mysql");

class DAOUsers {

    constructor(poolCon) {
        this.pool = poolCon;
    }

    isUserCorrect(email, password, callback) {
        let query = "select * from usuario where email = ? and pass = ?";
        let params = [email, password];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        if (rows.length == 0) {
                            callback(null, null)
                        } else {
                            callback(null, {
                                id: rows[0].id,
                                img: rows[0].img,
                                puntos: rows[0].points
                            });
                        }
                    }
                });
                connection.release();
            }
        });
    }

    getUserImageName(email, callback) {
        let query = "select img from user where email = ?";
        let params = [email];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        if (rows.length == 0) {
                            callback(new Error("El usuario no existe"))
                        } else {
                            if (rows.img == undefined) {
                                callback(null, "El usuario no tiene imagen")
                            } else {
                                callback(null, rows.img);
                            }
                        }
                    }
                });
                connection.release();
            }
        });
    }

    // insert de usuario
    // insert into usuario(email, pass, full_name, sexo, nacimiento, img, points) VALUES ("sergio", '12345', "sergi", 'masculino', null, null, 0)
    addUser(email, pass, full_name, sexo, nacimiento, img, callback) {
        let puntos = 0;
        let query = "insert into usuario(email, pass, full_name, sexo, nacimiento, img, points) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let params = [email, pass, full_name, sexo, nacimiento, img, puntos];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("El email ya esta registrado"));
                    } else {
                        callback(null, { id: rows.insertId, puntos: puntos, img: img });
                    }
                });
                connection.release();
            }
        });
    }


    read(id, callback) {
        let query = "select * from usuario where id = ?";
        let params = [id];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        if (rows.length == 0) {
                            callback(null, null);
                        } else {
                            //console.log(rows[0]);
                            callback(null, {
                                email: rows[0].email,
                                full_name: rows[0].full_name,
                                sexo: rows[0].sexo,
                                nacimiento: rows[0].nacimiento,
                                puntos: rows[0].points,
                                img: rows[0].img
                            });
                        }
                    }
                });
                connection.release();
            }
        });
    }


    readInfoExtra(id, callback) {
        let query = "select titulo, descripcion from infoextra where idUsuario = ?";
        let params = [id];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"));
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        if (rows.length == 0) {
                            callback(null, null);
                        } else {
                            console.log(rows);
                            callback(null, rows);
                        }
                    }
                });
                connection.release();
            }
        });
    }


    isUserFriend(miId, otherId, callback) {
        let query = "select amigo1 from amigos " +
            "where amigo2 = ? and amigo1 = ? and estado = 'aceptado' union " +
            "select amigo2 from amigos " +
            "where amigo1 = ? and amigo2 = ? and estado = 'aceptado'";
        let params = [miId, otherId, miId, otherId];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        //console.log(error.message)
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        let amistad = false;
                        if (rows.length > 0) amistad = true
                        callback(null, amistad);
                    }
                });
                connection.release();
            }
        });
    }


    getAmigos(id, callback) {
        let query = "select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo1) " +
            "where a.amigo2 = ? union " +
            "select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo2) " +
            "where a.amigo1 = ? and estado = 'aceptado'";
        let params = [id, id, id];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        //console.log(error.message)
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        let pendientes = [];
                        let amigos = [];
                        rows.forEach(element => {
                            if (element.estado == "pendiente") {
                                pendientes.push(element);
                            } else {
                                amigos.push(element);
                            }
                        });
                        callback(null, { pendientes, amigos });
                    }
                });
                connection.release();
            }
        });
    }


    addAmigo(mio, otro, callback) {
        let query = "update amigos set estado = 'aceptado' where amigo1 = ? and amigo2 = ?";
        let query2 = "delete from amigos where amigo1 = ? and amigo2 = ?";
        let params = [otro, mio];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        //console.log(error.message)
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        connection.query(query2, [mio, otro], function(error2, rows) {
                            connection.release();
                            if (error2) {
                                //console.log(error.message)
                                callback(new Error("Error en la consulta a la bd"));
                            } else {
                                callback(null);
                            }
                        });
                    }
                });
            }
        });
    }


    deleteAmigo(mio, otro, callback) {
        let query = "delete from amigos where (amigo1 = ? and amigo2 = ?) or (amigo1 = ? and amigo2 = ?)";
        let params = [otro, mio, mio, otro];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        callback(null)
                    }
                });
                connection.release();
            }
        });
    }


    update(id, email, pass, full_name, sexo, nacimiento, img, callback) {
        let query = "UPDATE usuario SET email = ?, pass= ?, full_name = ?, sexo = ?, nacimiento = ?, img = ? WHERE id = ?";
        let params = [id, email, pass, full_name, sexo, nacimiento, img];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        callback(null);
                    }
                });
                connection.release();
            }
        });
    }


    /*
    select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo1)
            where a.amigo2 = 1 and u.full_name like "%ernesto%" and estado = 'aceptado' union
            select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo2)
            where a.amigo1 = 1 and u.full_name like "%ernesto%" and estado = 'pendiente' union
            select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo2)
            where a.amigo1 = 1 and estado = 'aceptado' and u.full_name like "%ernesto%" union
            SELECT uu.id, uu.full_name, uu.img, null as estado from usuario uu
            where uu.id <> 1 and uu.full_name like "%ernesto%" and
            uu.id not in (
            select u.id from amigos a join usuario u on (u.id = a.amigo1)
            where a.amigo2 = 1 and estado = 'aceptado' and u.full_name like "%ernesto%"
            ) and uu.id not in (
            select u.id from amigos a join usuario u on (u.id = a.amigo2)
            where a.amigo1 = 1 and u.full_name like "%ernesto%"
            )
    */

    readByName(name, miId, callback) {
        let nombre = '%' + name + '%';
        let query = "select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo1) " +
            "where a.amigo2 = ? and u.full_name like ? and estado = 'aceptado' union " +
            "select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo1) " +
            "where a.amigo2 = ? and u.full_name like ? and estado = 'pendiente' union " +
            "select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo2) " +
            "where a.amigo1 = ? and estado = 'aceptado' and u.full_name like ? union " +
            "select u.id, u.full_name, u.img, a.estado from amigos a join usuario u on (u.id = a.amigo2) " +
            "where a.amigo1 = ? and estado = 'pendiente' and u.full_name like ? union " +
            "SELECT uu.id, uu.full_name, uu.img, null as estado from usuario uu " +
            "where uu.id <> ? and uu.full_name like ? and " +
            "uu.id not in (" +
            "select u.id from amigos a join usuario u on (u.id = a.amigo1) " +
            "where a.amigo2 = ? and estado = 'aceptado' and u.full_name like ?" +
            ") and uu.id not in (" +
            "select u.id from amigos a join usuario u on (u.id = a.amigo1) " +
            "where a.amigo2 = ? and estado = 'pendiente' and u.full_name like ?" +
            ") and uu.id not in (" +
            "select u.id from amigos a join usuario u on (u.id = a.amigo2) " +
            "where a.amigo1 = ? and estado = 'aceptado' and u.full_name like ?" +
            ") and uu.id not in (" +
            "select u.id from amigos a join usuario u on (u.id = a.amigo2) " +
            "where a.amigo1 = ? and estado = 'pendiente' and u.full_name like ?)";
        let params = [miId, nombre, miId, nombre, miId, nombre,
            miId, nombre, miId, nombre, miId, nombre,
            miId, nombre, miId, nombre, miId, nombre
        ];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        //console.log(error.message)
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        let users = [];
                        rows.forEach(element => {
                            users.push({
                                id: element.id,
                                img: element.img,
                                name: element.full_name,
                                estado: element.estado
                            });
                        });
                        //console.log(users);
                        callback(null, users);
                    }
                });
                connection.release();
            }
        });
    }


    solicitar(miId, otroId, callback) {
        let query = "insert into amigos values (?, ?, 'pendiente')";
        let params = [miId, otroId];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        //console.log(error.message)
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        callback(null)
                    }
                });
                connection.release();
            }
        });
    }



}

module.exports = DAOUsers;