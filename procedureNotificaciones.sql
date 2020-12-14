CREATE or REPLACE PROCEDURE getNotifsOfUser(idUsr int(11)) AS

DECLARE

    CREATE TYPE fila_type AS OBJECT ( 
        otherId int(11),
        full_name varchar(100),
        respOtro int(11),
        resultado varchar(100),
        pregunta int(11),
        textoPreg varchar(100),
        respYo varchar(100) 
    );

    create TYPE fila_arr IS TABLE OF fila_type;

    fila fila_type;
    result fila_arr;
    i INTEGER;
	
    ntfs CURSOR FOR
    	select propietario, respondido_por, pregunta 
        from notificaciones where propietario = idUsr;
        
    prop int(11);
    responde_por int(11);
    preg int(11;

    otherId int(11);                    
    full_name varchar(100);                    
    respOtro int(11);                    
    resultado varchar(100);                    
    pregunta int(11);
    textoPreg varchar(100);
    respYo varchar(100);
	

BEGIN

    i := 0;

    OPEN ntfs;

    FETCH ntfs into prop, responde_por, preg;
    WHILE ntfs%FOUND
    LOOP
        /* Procesamiento de los registros recuperados */
        /*dbms_output.put_line(propietario || responde_por || preg);*/

        /* datos del usuario que me envia la notificacion */
        SELECT u.id, u.full_name into otherId, full_name
        FROM usuario u join notificaciones n on (u.id = n.respondido_por)
        where n.propietario = prop and n.respondido_por = responde_por;

        /* respuesta y resultado del usuario que me envia la notificacion */
        select r.respuesta, r.resultado into respOtro, resultado
        from notificaciones n join resp_por_mi r on (n.propietario = r.responde_por)
        where n.propietario = prop and r.usuario = responde_por and r.pregunta = preg;

        /* id y texto de la pregunta */
        SELECT id, texto into pregunta, textoPreg
        from preguntas where id = preg;

        /* mi respuesta de la pregunta */
        SELECT y.respuesta into respYo
        FROM notificaciones n join resp_por_mi m on (n.propietario = m.usuario)
        where n.propietario = prop and m.pregunta = preg;

        fila := fila_type(otherId, full_name, respOtro, resultado, pregunta, textoPreg, respYo);
        result(i) := fila;

        i := i + 1;

        FETCH ntfs into prop, responde_por, preg;
    END LOOP;

    CLOSE ntfs;  
                     
END;