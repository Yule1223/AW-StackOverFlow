-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 13-01-2021 a las 23:58:37
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `4cero4`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answer`
--

CREATE TABLE `answer` (
  `id` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `text` text NOT NULL,
  `date` varchar(100) NOT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `hands_up` int(11) NOT NULL DEFAULT 0,
  `hands_down` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `answer`
--

INSERT INTO `answer` (`id`, `user`, `text`, `date`, `points`, `hands_up`, `hands_down`) VALUES
(23, 'lucas@404.es', 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo, dependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra para posicionarse respecto a ella.\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute | fixed | inherit | initial.', '2021-01-13', 0, 0, 0),
(24, 'emy@404.es', 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en la fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa un ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.', '2021-01-13', 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `award`
--

CREATE TABLE `award` (
  `id` int(11) NOT NULL,
  `metal` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `title` text NOT NULL,
  `text` text NOT NULL,
  `date` varchar(100) NOT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `hands_up` int(11) NOT NULL DEFAULT 0,
  `hands_down` int(11) NOT NULL DEFAULT 0,
  `visit` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `question`
--

INSERT INTO `question` (`id`, `user`, `title`, `text`, `date`, `points`, `hands_up`, `hands_down`, `visit`) VALUES
(94, 'nico@404.es', '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', '2021-01-13', 0, 0, 0, 1),
(95, 'roberto@404.es', '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', '2021-01-13', 0, 0, 0, 1),
(96, 'sfg@404.es', 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay:\r\nasignaciones =\r\ncomparaciones == y ===\r\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también compara el tipo (como un equals de java).', '2021-01-13', 0, 0, 0, 0),
(97, 'marta@404.es', 'Problema con asincronismo en Node', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pg-node. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro modulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi seguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan disponibles al momento de usarlos.', '2021-01-13', 0, 0, 0, 0),
(98, 'lucas@404.es', '¿Qué es la inyección SQL y cómo puedo evitarla?', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que guardan información en una base de datos (especialmente en PHP y MySQL) y que contienen graves problemas de seguridad relacionados principalmente con la inyección SQL.\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario no da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes sobre el tema así que decidí escribir esta pregunta.', '2021-01-13', 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('BQKwT1TvvrmxLP56E0VD41PeLr6BAb5Y', 1610665064, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"lucas@404.es\",\"currentName\":\"Lucas\",\"currentId\":18}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag`
--

CREATE TABLE `tag` (
  `questionid` int(11) NOT NULL,
  `tag` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tag`
--

INSERT INTO `tag` (`questionid`, `tag`) VALUES
(94, 'css'),
(94, 'css3'),
(95, 'css'),
(95, 'html'),
(96, 'javascript'),
(97, 'nodejs'),
(98, 'mysql'),
(98, 'sql');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `img` varchar(100) NOT NULL,
  `reputation` int(11) NOT NULL DEFAULT 1,
  `date` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id_user`, `email`, `password`, `name`, `img`, `reputation`, `date`) VALUES
(14, 'nico@404.es', '1234', 'Nico', 'nico.png', 1, '2021-01-13'),
(15, 'roberto@404.es', '1234', 'Roberto', 'roberto.png', 1, '2021-01-13'),
(16, 'sfg@404.es', '1234', 'SFG', 'sfg.png', 1, '2021-01-13'),
(17, 'marta@404.es', '1234', 'Marta', 'marta.png', 1, '2021-01-13'),
(18, 'lucas@404.es', '1234', 'Lucas', 'defecto2.png', 1, '2021-01-13'),
(19, 'emy@404.es', '1234', 'Emy', 'amy.png', 1, '2021-01-13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_answer`
--

CREATE TABLE `user_answer` (
  `id_question` int(11) NOT NULL,
  `id_answer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user_answer`
--

INSERT INTO `user_answer` (`id_question`, `id_answer`) VALUES
(94, 23),
(95, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_award_answer`
--

CREATE TABLE `user_award_answer` (
  `user` varchar(100) NOT NULL,
  `award` int(11) NOT NULL,
  `date` varchar(100) NOT NULL,
  `answer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_award_question`
--

CREATE TABLE `user_award_question` (
  `user` varchar(100) NOT NULL,
  `award` int(11) NOT NULL,
  `date` varchar(100) NOT NULL,
  `question_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_visit`
--

CREATE TABLE `user_visit` (
  `user` varchar(100) NOT NULL,
  `id_question` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user_visit`
--

INSERT INTO `user_visit` (`user`, `id_question`) VALUES
('lucas@404.es', 94),
('emy@404.es', 95);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vote_answer`
--

CREATE TABLE `vote_answer` (
  `user` varchar(100) NOT NULL,
  `id_answer` int(11) NOT NULL,
  `hands_up` tinyint(1) NOT NULL DEFAULT 0,
  `hands_down` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vote_question`
--

CREATE TABLE `vote_question` (
  `user` varchar(100) NOT NULL,
  `id_question` int(11) NOT NULL,
  `hands_up` tinyint(1) NOT NULL DEFAULT 0,
  `hands_down` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `points` (`points`),
  ADD KEY `handsup` (`hands_up`),
  ADD KEY `handsdown` (`hands_down`);

--
-- Indices de la tabla `award`
--
ALTER TABLE `award`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `points` (`points`),
  ADD KEY `handsup` (`hands_up`),
  ADD KEY `handsdown` (`hands_down`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`questionid`,`tag`),
  ADD KEY `question` (`questionid`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`) USING BTREE,
  ADD KEY `reputation` (`reputation`);

--
-- Indices de la tabla `user_answer`
--
ALTER TABLE `user_answer`
  ADD KEY `question_foreign` (`id_question`),
  ADD KEY `answer_foreign` (`id_answer`);

--
-- Indices de la tabla `user_award_answer`
--
ALTER TABLE `user_award_answer`
  ADD KEY `user_foreign_award` (`user`),
  ADD KEY `answer_id_award` (`answer_id`),
  ADD KEY `award_foreign_award` (`award`);

--
-- Indices de la tabla `user_award_question`
--
ALTER TABLE `user_award_question`
  ADD KEY `email_foreign` (`user`),
  ADD KEY `award_foreign` (`award`),
  ADD KEY `id_foreign_award` (`question_id`);

--
-- Indices de la tabla `user_visit`
--
ALTER TABLE `user_visit`
  ADD KEY `email_visit_foreign` (`user`),
  ADD KEY `question_visit_foreign` (`id_question`);

--
-- Indices de la tabla `vote_answer`
--
ALTER TABLE `vote_answer`
  ADD KEY `vote_answer_foreign` (`user`),
  ADD KEY `vote_answer_foreign2` (`id_answer`);

--
-- Indices de la tabla `vote_question`
--
ALTER TABLE `vote_question`
  ADD KEY `foreign_user` (`user`),
  ADD KEY `foreign_question` (`id_question`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answer`
--
ALTER TABLE `answer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `award`
--
ALTER TABLE `award`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `autor_foreign` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `user_foreign` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `questionid_foreign` FOREIGN KEY (`questionid`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_answer`
--
ALTER TABLE `user_answer`
  ADD CONSTRAINT `answer_foreign` FOREIGN KEY (`id_answer`) REFERENCES `answer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `question_foreign` FOREIGN KEY (`id_question`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_award_answer`
--
ALTER TABLE `user_award_answer`
  ADD CONSTRAINT `answer_id_award` FOREIGN KEY (`answer_id`) REFERENCES `answer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `award_foreign_award` FOREIGN KEY (`award`) REFERENCES `award` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_foreign_award` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_award_question`
--
ALTER TABLE `user_award_question`
  ADD CONSTRAINT `award_foreign` FOREIGN KEY (`award`) REFERENCES `award` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `email_foreign` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_foreign_award` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_visit`
--
ALTER TABLE `user_visit`
  ADD CONSTRAINT `email_visit_foreign` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `question_visit_foreign` FOREIGN KEY (`id_question`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vote_answer`
--
ALTER TABLE `vote_answer`
  ADD CONSTRAINT `vote_answer_foreign` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vote_answer_foreign2` FOREIGN KEY (`id_answer`) REFERENCES `answer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vote_question`
--
ALTER TABLE `vote_question`
  ADD CONSTRAINT `foreign_question` FOREIGN KEY (`id_question`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `foreign_user` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
