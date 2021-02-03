"use strict";

const path = require("path");
const config = require("../config");
const mysql = require("mysql");
const moment = require('moment');
const today = moment();
const pool = mysql.createPool(config.mysqlConfig);
const modelUsers = require("../models/modelUsers");
const modelU = new modelUsers(pool);
let rootPath = path.resolve(__dirname, '..')

class controllerUsers{
identificacionRequerida(request, response, next) {
    if (request.session.currentUser !== undefined && request.session.currentName !== undefined && request.session.currentId !== undefined) {
        response.locals.userEmail = request.session.currentUser;
        response.locals.userName = request.session.currentName;
        response.locals.userId = request.session.currentId;
        next();
    } else {
        response.redirect("/login");
    }
}

login(request, response){
    modelU.isUserCorrect(request.body.email, request.body.password, cb_isUserCorrect);
    
    function cb_isUserCorrect(err, result, rows){
        if (err) {
            response.status(500); 
            next(err);
            response.render("login", {errorMsg:"Error interno de acceso a la base de datos"});
        } else{
            if(!result){
                response.status(200);
                response.render("login", { errorMsg: "Email y/o contraseña no válidos" });
            }
            else{
                request.session.currentUser = request.body.email;
                response.locals.userEmail = request.body.email;
                request.session.currentName = rows.name;
                response.locals.userName = request.session.currentName; 
                request.session.currentId = rows.id_user;
                response.locals.userId = request.session.currentId;

                response.render("principal", {name: rows.name});

            }
        }
}
}

imagenUsuario(request, response){
    modelU.getUserImageName(response.locals.userEmail, cb_getImg);

    function cb_getImg(err, result, imagen){
        if (err) {
            response.status(500);
            next(err);
        } else{
            response.status(200);
            response.sendFile(path.join(rootPath, "public/img/profile_imgs", imagen));
        }
    }
}

formular_cuenta(request, response){
    let email = request.body.email;
    let passw1 = request.body.passw1;
    let passw2 = request.body.passw2;
    let name = request.body.name;

    if(passw1!==passw2){
        response.render("crear_cuenta", {errorMsg:"La contraseña de verificación no coincide"});
    }
    else{
    modelU.isUserExist(email, cb_isUserExist);

    function cb_isUserExist(err, result){
        if (err) {
            response.status(500); 
            response.render("crear_cuenta", {errorMsg:"Error interno de acceso a la base de datos"});
        } else{
            if(!result){ //si no existia ese email en la BD
                let image = null;
                if(request.file){
                    image = request.file.filename;
                }
                else{
                    var aleatorio = Math.floor(Math.random()*(3)) + 1;
                    image = "defecto"+aleatorio+".png";
                }
                let date = today.format('YYYY-MM-DD');
                modelU.insertUser(email, passw1, name, image, date, cb_insertUser);
                function cb_insertUser(err1, result1){
                    if (err1) {
                        response.status(500); 
                        response.render("crear_cuenta", {errorMsg:"Error interno de acceso a la base de datos"});
                    } else{
                        if(!result1){
                            response.status(200);
                            response.render("crear_cuenta", { errorMsg: "Error, inserta de nuevo" });
                        }
                        else{
                            response.redirect("/login");
                        }
                    }
                }
            }
            else{
                response.render("crear_cuenta", {errorMsg:"Usuario ya existe"});
            }
        }
    }
}
}

listar_users(request, response){
    modelU.getAllUsers(cb_getAllUsers);
    
    function cb_getAllUsers(err, result, info){
        if (err) {
            response.status(500);
            next(err);
        } else{
            response.status(200);
            var userList = info;
            userList.forEach(function(user){
                if(user.tags!==null){
                    var tags = user.tags.split(",");
                    tags.sort();
                    var contador=0;
                    var contMas=0;
                    var aux=tags[0];
                    var tagMas=tags[0];
                    for (let i = 0; i < tags.length; i++) {
                        if(aux == tags[i]){
                            contador++;
                        } else {
                            if(contador>contMas){
                                tagMas=aux;
                                contMas=contador;
                            }
                            else{
                                contador=1;
                            }
                            aux=tags[i];
                        }
                        if(i==(tags.length-1) && aux==tags[i]){
                            if(contador>contMas){
                                tagMas=aux;
                            }
                        }
                    }
                    user.tags=tagMas;
                }
            });
            let title = "Usuarios";
            response.render("listar_users", { title: title, userList: userList});
        }
    }
}

getUsersByText(request, response){
    modelU.getUsersByText("%"+request.body.filtrouser+"%", cb_getUsersByText);

    function cb_getUsersByText(err, result, info){
        if (err) {
            response.status(500);
            next(err);
        } else{
            response.status(200);
            var userList = info;
        if(userList!==undefined){
            userList.forEach(function(user){
                if(user.tags!==null){
                    var tags = user.tags.split(",");
                    tags.sort();
                    var contador=0;
                    var contMas=0;
                    var aux=tags[0];
                    var tagMas=tags[0];
                    for (let i = 0; i < tags.length; i++) {
                        if(aux == tags[i]){
                            contador++;
                        } else {
                            if(contador>contMas){
                                tagMas=aux;
                                contMas=contador;
                            }
                            else{
                                contador=1;
                            }
                            aux=tags[i];
                        }
                        if(i==(tags.length-1) && aux==tags[i]){
                            if(contador>contMas){
                                tagMas=aux;
                            }
                        }
                    }
                    user.tags=tagMas;
                }
            });
        }
            let title = `Usuarios filtrados por ["${request.body.filtrouser}"]`;
            response.render("listar_users", { title: title, userList: userList});
        }
    }
}

getPerfilUser(request, response){

    modelU.getUserPerfil(request.params.id, cb_getUserPerfil);

    function cb_getUserPerfil(err, result, info){
        if (err) {
            response.status(500);
            next(err);
        } else{
            let user = info;

            if(user===undefined){
                response.status(404);
                response.render("error404", { url: request.url });
            }
            else{
            response.status(200);
            if(user.orosA!==null && user.orosQ!==null)
                user.oros = user.orosQ.concat(users.orosA);
            else if(user.orosA===null && user.orosQ!==null)
                user.oros = user.orosQ;
            else if(user.orosA!==null && user.orosQ===null) 
                user.oros = user.orosA;

            if(user.platasA!==null && user.platasQ!==null)
                user.platas = user.platasQ.concat(users.platasA);
            else if(user.platasA===null && user.platasQ!==null)
                user.platas = user.platasQ;
            else if(user.platasA!==null && user.platasQ===null) 
                user.platas = user.platasA;

            if(user.broncesA!==null && user.broncesQ!==null)
                user.bronces = user.broncesQ.concat(users.broncesA);
            else if(user.broncesA===null && user.broncesQ!==null)
                user.bronces = user.broncesQ;
            else if(user.broncesA!==null && user.broncesQ===null) 
                user.bronces = user.broncesA;
            
            if(user.oros!==null&&user.oros!==undefined){
                user.oros = user.oros.split(",");
                user.nOros = user.oros.length;
            }
            else
                user.nOros = 0;
            if(user.platas!==null&&user.platas!==undefined){
                user.platas = user.platas.split(",");
                user.nPlatas = user.platas.length;
            }
            else
                user.nPlatas = 0;
            if(user.bronces!=null&&user.bronces!==undefined){
                user.bronces = user.bronces.split(",");
                user.nBronces = user.bronces.length;
            }
            else
                user.nBronces = 0;

            response.render("perfil_user", {user: user});
            }
        }
    }
}

}
module.exports = controllerUsers;
