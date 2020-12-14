-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-01-2020 a las 14:23:07
-- Versión del servidor: 10.4.10-MariaDB
-- Versión de PHP: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facebluff`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `amigo1` int(11) DEFAULT NULL,
  `amigo2` int(11) DEFAULT NULL,
  `estado` enum('aceptado','pendiente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `amigos`
--

INSERT INTO `amigos` (`amigo1`, `amigo2`, `estado`) VALUES
(1, 2, 'aceptado'),
(3, 2, 'aceptado'),
(3, 5, 'aceptado'),
(10, 2, 'aceptado'),
(1, 6, 'pendiente'),
(4, 2, 'pendiente'),
(5, 2, 'pendiente'),
(6, 2, 'aceptado'),
(2, 7, 'aceptado'),
(3, 1, 'pendiente'),
(3, 4, 'pendiente'),
(3, 7, 'pendiente'),
(3, 12, 'pendiente'),
(14, 15, 'aceptado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenessubidas`
--

CREATE TABLE `imagenessubidas` (
  `usuarioId` int(11) NOT NULL,
  `imagen` varchar(150) NOT NULL,
  `descripcion` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `imagenessubidas`
--

INSERT INTO `imagenessubidas` (`usuarioId`, `imagen`, `descripcion`) VALUES
(1, '51d09e4c6d228635a415d228795c07ad', 'Esta es manyula'),
(1, '1b06785f821f9d646ba3b8818f0a9292', 'Este es mi amigo cristofer , es muy guapo pero es un poco chuleta'),
(1, '7f922e7524248cbfba48be1ebc9ebc4c', 'Esta es Rosalia y he vendido sus entradas por el doble de lo que me costaron'),
(1, '9df5b065fdcf289d32f9afb5cd2514d9', 'Este es el pizzero, a veces me trae las pizzas frías pero bueno es majo y no se queda con las vueltas'),
(2, '2595dd638ea18ee56a7b93cc58cb9737', 'foto'),
(2, '5db542134eb8439706a90614c0471979', 'Chica'),
(2, '29574076210773ab10b3559deec5975e', 'Otro'),
(2, 'dd594ea0ac433dedc9349751b51e79c3', 'una foto muy cuqui jaja no se que mas poner parece suficientemente largo'),
(1, 'b0e279638c2fe48d42da27f1d325aa18', 'jajajaja como me rio con esta tia'),
(3, '8258f92f486f04022647a50a565af082', 'jaja'),
(15, '039c2832d5d17a58929dbcf4b62e7560', 'desc'),
(15, '969fccec27ddd4f9780885281ad6bad9', 'foto 2 texto grande para que se ajuste al tamaño yo qyue se');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `infoextra`
--

CREATE TABLE `infoextra` (
  `idUsuario` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `propietario` int(11) NOT NULL,
  `respondido_por` int(11) NOT NULL,
  `pregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`propietario`, `respondido_por`, `pregunta`) VALUES
(1, 3, 3),
(3, 1, 3),
(3, 2, 3),
(3, 5, 3),
(3, 5, 6),
(5, 3, 5),
(7, 2, 4),
(14, 15, 6),
(14, 15, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `creador` int(11) DEFAULT NULL,
  `texto` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id`, `creador`, `texto`) VALUES
(1, 1, '¿Como te llamas?'),
(2, 1, '¿Son los reyes los padres?'),
(3, 1, '¿Vamos a por la matricula?'),
(4, 1, '¿Es lo mismo Fran que Paco?'),
(5, 1, '¿Aprobara Elam AW?'),
(6, 1, '¿Cuantas voy a aprobar?'),
(7, 12, '¿Va todo correcto?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `idPregunta` int(11) NOT NULL,
  `texto` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestas`
--

INSERT INTO `respuestas` (`idPregunta`, `texto`) VALUES
(1, 'Cristofer'),
(1, 'Ernesto'),
(1, 'Sergio'),
(2, 'No'),
(2, 'Si'),
(3, 'No'),
(3, 'Si'),
(4, 'No'),
(4, 'Para algunos si y para otros no'),
(4, 'Si'),
(5, 'Acabara aprobando no se sabe como'),
(5, 'No'),
(5, 'No creo'),
(6, 'Algunas'),
(6, 'Casi todas'),
(6, 'Ninguna'),
(6, 'Todas'),
(7, 'No'),
(7, 'Si');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resp_por_mi`
--

CREATE TABLE `resp_por_mi` (
  `usuario` int(11) DEFAULT NULL,
  `pregunta` int(11) DEFAULT NULL,
  `respuesta` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `resp_por_mi`
--

INSERT INTO `resp_por_mi` (`usuario`, `pregunta`, `respuesta`) VALUES
(1, 3, 'no se'),
(3, 3, 'Si'),
(10, 3, 'No'),
(6, 3, 'Obviamente'),
(2, 3, 'Si'),
(7, 4, 'Claro que no'),
(3, 6, 'Todas'),
(5, 5, 'No'),
(14, 6, 'Todas'),
(14, 7, 'No'),
(15, 7, '    ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resp_por_otro`
--

CREATE TABLE `resp_por_otro` (
  `usuario` int(11) DEFAULT NULL,
  `responde_por` int(11) DEFAULT NULL,
  `pregunta` int(11) DEFAULT NULL,
  `respuesta` varchar(100) NOT NULL,
  `resultado` enum('acierto','fallo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `resp_por_otro`
--

INSERT INTO `resp_por_otro` (`usuario`, `responde_por`, `pregunta`, `respuesta`, `resultado`) VALUES
(2, 1, 3, 'Si', 'fallo'),
(2, 3, 3, 'Si', 'acierto'),
(2, 10, 3, 'Si', 'fallo'),
(1, 3, 3, 'No', 'fallo'),
(1, 2, 3, 'Si', 'acierto'),
(2, 7, 4, 'Claro que no', 'acierto'),
(5, 3, 6, 'Casi todas', 'fallo'),
(3, 5, 5, 'No creo', 'fallo'),
(5, 3, 3, 'Obviamente', 'fallo'),
(3, 1, 3, 'no se', 'acierto'),
(3, 2, 3, 'Si', 'acierto'),
(15, 14, 7, 'Si', 'fallo'),
(15, 14, 6, 'Todas', 'acierto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('C_wqJrsJ-4y_A5__kINoCKHRwmFv5tlt', 1576605210, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"userId\":14,\"img\":null,\"puntos\":0}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pass` varchar(45) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `sexo` enum('masculino','femenino','otro') NOT NULL,
  `nacimiento` datetime DEFAULT NULL,
  `img` varchar(45) DEFAULT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `pass`, `full_name`, `sexo`, `nacimiento`, `img`, `points`) VALUES
(1, 'sergio@ucm.es', '1a', 'Sergio Manzanaro', 'masculino', '1998-07-05 00:00:00', '1b06785f821f9d646ba3b8818f0a9292', 950),
(2, 'cristofer@ucm.es', '1a', 'Cristo Fernando López', 'masculino', '2018-02-16 00:00:00', NULL, 10050),
(3, 'ernesto@ucm.es', '1a', 'Ernesto Vivar Laviña', 'masculino', '2018-02-16 00:00:00', NULL, 0),
(4, 'fran@ucm.es', '1a', 'Francisco Calero', 'masculino', '2018-02-16 00:00:00', NULL, 0),
(5, 'david@ucm.es', '1a', 'David Salido', 'masculino', '2018-02-16 00:00:00', NULL, 0),
(6, 'euge@ucm.es', '1a', 'Eugenia Moreno Diaz', 'femenino', '2018-02-16 00:00:00', NULL, 0),
(7, 'iñigo@ucm.es', '1a', 'Iñigo Garcia-Conde', 'masculino', '2018-02-16 00:00:00', NULL, 0),
(8, 'elam@ucm.es', '1a', 'Elam Uceda', 'otro', '2018-02-16 00:00:00', NULL, 0),
(9, 'esther@ucm.es', '1a', 'Esther Peñas', 'femenino', '2018-02-16 00:00:00', NULL, 0),
(10, 'merche@ucm.es', '1a', 'Mercedes Herrero', 'femenino', '2018-02-16 00:00:00', NULL, 0),
(11, 'osobuco@ucm.es', '1a', 'That thing bro', 'masculino', '2018-02-16 00:00:00', NULL, 0),
(12, 'marina@ucm.es', '1a', 'Marina de la Cruz', 'femenino', '2018-02-16 00:00:00', NULL, 0),
(13, 'sara@ucm.es', '1a', 'Sara Roman Navarro', 'femenino', '2018-02-16 00:00:00', NULL, 0),
(14, 'prueba1@ucm.es', 'prueba', 'nueva prueba 1', 'masculino', '2017-12-31 00:00:00', NULL, 0),
(15, 'prueba2@ucm.es', 'prueba', 'prueba 2', 'femenino', NULL, NULL, 49800),
(16, 'prueba3@ucm.es', 'prueba', 'prueba 3', 'otro', '2018-01-01 00:00:00', 'ca4a72bb7b78f830b1e0f07ed8df8c64', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD KEY `amigo1` (`amigo1`),
  ADD KEY `amigo2` (`amigo2`);

--
-- Indices de la tabla `imagenessubidas`
--
ALTER TABLE `imagenessubidas`
  ADD KEY `usuarioId` (`usuarioId`);

--
-- Indices de la tabla `infoextra`
--
ALTER TABLE `infoextra`
  ADD PRIMARY KEY (`idUsuario`,`titulo`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`propietario`,`respondido_por`,`pregunta`),
  ADD KEY `respondido_por` (`respondido_por`),
  ADD KEY `pregunta` (`pregunta`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creador` (`creador`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`idPregunta`,`texto`);

--
-- Indices de la tabla `resp_por_mi`
--
ALTER TABLE `resp_por_mi`
  ADD KEY `usuario` (`usuario`),
  ADD KEY `pregunta` (`pregunta`);

--
-- Indices de la tabla `resp_por_otro`
--
ALTER TABLE `resp_por_otro`
  ADD KEY `responde_por` (`responde_por`),
  ADD KEY `usuario` (`usuario`),
  ADD KEY `pregunta` (`pregunta`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `amigos_ibfk_1` FOREIGN KEY (`amigo1`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `amigos_ibfk_2` FOREIGN KEY (`amigo2`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenessubidas`
--
ALTER TABLE `imagenessubidas`
  ADD CONSTRAINT `imagenessubidas_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `infoextra`
--
ALTER TABLE `infoextra`
  ADD CONSTRAINT `infoextra_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`propietario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`respondido_por`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notificaciones_ibfk_3` FOREIGN KEY (`pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `preguntas_ibfk_1` FOREIGN KEY (`creador`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`idPregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resp_por_mi`
--
ALTER TABLE `resp_por_mi`
  ADD CONSTRAINT `resp_por_mi_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `resp_por_mi_ibfk_2` FOREIGN KEY (`pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resp_por_otro`
--
ALTER TABLE `resp_por_otro`
  ADD CONSTRAINT `resp_por_otro_ibfk_1` FOREIGN KEY (`responde_por`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `resp_por_otro_ibfk_2` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `resp_por_otro_ibfk_3` FOREIGN KEY (`pregunta`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
