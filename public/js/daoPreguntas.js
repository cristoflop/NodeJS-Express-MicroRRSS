"use strict"

const mysql = require("mysql");

class DAOPreguntas {

    constructor(poolCon) {
        this.pool = poolCon;
    }


    heRespondido(miId, idPreg, callback) {
        let query = "SELECT usuario, pregunta FROM resp_por_mi where usuario = ? and pregunta = ?"
        let params = [miId, idPreg];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        if (rows.length == 0) {
                            callback(null, false)
                        } else {
                            callback(null, true)
                        }
                    }
                });
                connection.release();
            }
        });
    }


    readRandomQuestions(miId, numMax, callback) {
        let query = "SELECT p.id, p.texto FROM preguntas p ORDER BY Rand() LIMIT ?"
        let params = [numMax];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        callback(null, rows)
                    }
                });
                connection.release();
            }
        });
    }


    createQuestion(miId, texto, respuestasSet, callback) {
        let query = "INSERT INTO preguntas(creador, texto) VALUES (?, ?)";
        let params = [miId, texto];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta uno a la bd"));
                    } else {
                        let query2 = "INSERT INTO respuestas (idPregunta, texto) VALUES ?";
                        let respuestasInsert = [];
                        let respuestas = Array.from(respuestasSet);
                        respuestas.forEach((element) => {
                            respuestasInsert.push([rows.insertId, element]);
                        });
                        let params2 = [respuestasInsert];
                        connection.query(query2, params2, function(error2) {
                            connection.release();
                            if (error2) {
                                callback(new Error("Error en la consulta dos a la bd"));
                            } else {
                                callback(null);
                            }
                        });
                    }
                });
            }
        });
    }


    /**********************************************************************************************************************/


    questionSelected(idPregunta, miId, callback) {
        let query = "SELECT p.id, p.texto FROM preguntas p join resp_por_mi r on (p.id = r.pregunta) WHERE p.id = ? and r.usuario = ?";
        let params = [idPregunta, miId];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        let result = {};
                        if (rows.length == 0) { // yo no he respondido esa pregunta
                            let query2 = "select id, texto from preguntas where id = ?";
                            let params2 = [idPregunta];
                            connection.query(query2, params2, function(error2, rows2) {
                                connection.release();
                                if (error2) {
                                    callback(new Error("Error en la consulta dos a la bd: " + error2.message));
                                } else {
                                    result = {
                                        id: rows2[0].id,
                                        texto: rows2[0].texto,
                                        respondida: false
                                    }
                                    callback(null, result);
                                }
                            });
                        } else { // he respondido la pregunta
                            connection.release();
                            result = {
                                id: rows[0].id,
                                texto: rows[0].texto,
                                respondida: true
                            }
                            callback(null, result);
                        }
                    }
                });
            }
        });
    }


    /*
    SELECT u.img, u.full_name, u.id, o.resultado from usuario u join resp_por_otro o on (u.id = o.responde_por) 
            where o.usuario = 5 and o.pregunta = 6 and (o.responde_por in (
            select amigo1 from amigos where amigo1 = o.responde_por and amigo2 = o.usuario and estado = 'aceptado'
            ) or o.responde_por in (
            select amigo2 from amigos where amigo2 = o.responde_por and amigo1 = o.usuario and estado = 'aceptado'
            )) union 
            SELECT u.img, u.full_name, u.id, null as resultado from usuario u join resp_por_mi o on (u.id = o.usuario) 
            where (o.usuario in (
            select amigo2 from amigos where amigo1 = 5 and amigo2 = o.usuario and estado = 'aceptado'
            ) or o.usuario in (
            select amigo1 from amigos where amigo2 = 5 and amigo1 = o.usuario and estado = 'aceptado'
            ) ) and o.pregunta = 6
    */
    amigosQueHanRespondido(miId, idPregunta, callback) {
        let query = "SELECT u.img, u.full_name, u.id, o.resultado from usuario u join resp_por_otro o on (u.id = o.responde_por) " +
            "where o.usuario = ? and o.pregunta = ? and (o.responde_por in (" +
            "select amigo1 from amigos where amigo1 = o.responde_por and amigo2 = o.usuario and estado = 'aceptado'" +
            ") or o.responde_por in (" +
            "select amigo2 from amigos where amigo2 = o.responde_por and amigo1 = o.usuario and estado = 'aceptado'" +
            ")) union " +
            "SELECT u.img, u.full_name, u.id, null as resultado from usuario u join resp_por_mi o on (u.id = o.usuario) " +
            "where (o.usuario in (" +
            "select amigo2 from amigos where amigo1 = ? and amigo2 = o.usuario and estado = 'aceptado'" +
            ") or o.usuario in (" +
            "select amigo1 from amigos where amigo2 = ? and amigo1 = o.usuario and estado = 'aceptado'" +
            ") ) and o.pregunta = ?";
        let params = [miId, idPregunta, miId, miId, idPregunta];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"));
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        //console.log(rows)
                        let result = [];
                        rows.forEach((x, i) => {
                            let busqueda = result.findIndex(o => o.id === x.id);
                            if (busqueda == -1) {
                                result.push(x);
                            }
                        });
                        //console.log(result);
                        callback(null, result);
                    }
                });
                connection.release();
            }
        });
    }


    /**********************************************************************************************************************/


    readQuestionById(idPregunta, callback) {
        let query = "(SELECT p.id, p.texto as textoP, r.texto as textoR FROM preguntas p join respuestas r on (p.id = r.idPregunta) " +
            "WHERE p.id = ? union " +
            "SELECT p.id, p.texto as textoP, r.respuesta as textoR FROM preguntas p join resp_por_mi r on (p.id = r.pregunta)" +
            "WHERE p.id = ?) order by Rand() LIMIT 5";
        let params = [idPregunta, idPregunta];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd"));
                    } else {
                        if (rows.length == 0) {
                            callback(new Error("Error"));
                        } else {
                            let pregunta = rows[0].textoP;
                            let respuestas = [];
                            rows.forEach(x => respuestas.push(x.textoR));
                            //console.log(respuestas);
                            callback(null, pregunta, respuestas, rows[0].id);
                        }
                    }
                });
                connection.release();
            }
        });
    }


    addAnswerForMe(miId, idPregunta, respuesta, callback) {
        let query = "INSERT INTO resp_por_mi (usuario, pregunta, respuesta) VALUES (?, ?, ?)"
        let params = [miId, idPregunta, respuesta];
        //console.log(params)
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error) {
                    if (error) {
                        //console.log(error.message)
                        callback(new Error("Error en la consulta a la bd: "));
                    } else {
                        callback(null);
                    }
                });
                connection.release();
            }
        });
    }


    /* 
    (select p.id, y.usuario, p.texto as textoP, y.respuesta as textoR 
            from resp_por_mi y join preguntas p on (y.pregunta = p.id) 
            where p.id = 4 and y.usuario = 7) union
            ((select p.id, 7 as usuario, p.texto as textoP, r.texto as textoR 
            from preguntas p join respuestas r on (p.id = r.idPregunta) where p.id = 4) union 
           	(SELECT p.id, 7 as usuario, p.texto as textoP, r.respuesta as textoR FROM preguntas p join resp_por_mi r on (p.id = r.pregunta) 
            WHERE p.id = 4) order by Rand() limit 4)
    */
    getRespuestasDeOtro(user, preg, callback) {
        let query =
            "(select p.id, y.usuario, p.texto as textoP, y.respuesta as textoR " +
            "from resp_por_mi y join preguntas p on (y.pregunta = p.id) " +
            "where p.id = ? and y.usuario = ?) union " +
            "((select p.id, ? as usuario, p.texto as textoP, r.texto as textoR " +
            "from preguntas p join respuestas r on (p.id = r.idPregunta) where p.id = ?) union " +
            "(SELECT p.id, ? as usuario, p.texto as textoP, r.respuesta as textoR FROM preguntas p join resp_por_mi r on (p.id = r.pregunta)" +
            "WHERE p.id = ?) order by Rand() limit 4) order by Rand()";
        let params = [preg, user, user, preg, user, preg];
        //console.log(params)
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, rows) {
                    if (error) {
                        //console.log(error.message)
                        callback(new Error("Error en la consulta a la bd: " + error.message));
                    } else {
                        if (rows.length == 0) {
                            callback(new Error("Error"))
                        } else {
                            let pregunta = {
                                id: rows[0].id,
                                textoP: rows[0].textoP
                            };
                            let respuestas = [];
                            rows.forEach(x => respuestas.push(x.textoR));
                            callback(null, pregunta, new Set(respuestas));
                        }
                    }
                });
                connection.release();
            }
        });
    }


    addAnswerForOther(miId, otherId, idPreg, respuesta, callback) {
        let query = "select respuesta from resp_por_mi where usuario = ? and pregunta = ?";
        let params = [otherId, idPreg];
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexion a la bd"))
            } else {
                connection.query(query, params, function(error, texto) {
                    if (error) {
                        callback(new Error("Error en la consulta a la bd: "));
                    } else {
                        if (texto.length == 0) {
                            callback(new Error("Error"));
                        } else {
                            //console.log(texto[0])
                            let result = 'fallo';
                            if (texto[0].respuesta == respuesta) result = 'acierto';
                            query = "insert into resp_por_otro values (?, ?, ?, ?, ?)"
                            params = [miId, otherId, idPreg, respuesta, result];
                            connection.query(query, params, function(error2, rows2) {
                                if (error2) {
                                    callback(new Error("Error en la consulta dos a la bd: "));
                                } else {
                                    if (result == 'acierto') { // hay que actualizar los puntos del usuario
                                        query = "update usuario set points = points + 50 where id = ?";
                                        params = [miId];
                                        connection.query(query, params, function(error3, rows3) {
                                            connection.release();
                                            if (error3) {
                                                callback(new Error("Error en la consulta tres a la bd: "));
                                            } else {
                                                callback(null, result)
                                            }
                                        });
                                    } else {
                                        connection.release();
                                        callback(null, result)
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }


}


module.exports = DAOPreguntas;