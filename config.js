"use strict";
module.exports = {
    /*mysqlConfig: {
         host: "localhost",     // Ordenador que ejecuta el SGBD
         user: "root",          // Usuario que accede a la BD
         password: "",          // Contraseña con la que se accede a la BD
         database: "4cero4"     // Nombre de la base de datos
    },*/
    mysqlConfig: {
        host: "f80b6byii2vwv8cx.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",     // Ordenador que ejecuta el SGBD
        user: "tmcyr2okk49qmius",          // Usuario que accede a la BD
        password: "tltk9wogq4wr1gqg",          // Contraseña con la que se accede a la BD
        database: "bku1r78npvdqk3a3"     // Nombre de la base de datos
    },
    port: process.env.PORT || 3306                   // Puerto en el que escucha el servidor
    //port: 3306                   // Puerto en el que escucha el servidor
}