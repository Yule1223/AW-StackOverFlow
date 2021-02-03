"use strict";

const express = require("express");
const path = require("path");
const routerUsers = express.Router();
const controllerUsers = require("../controllers/controllerUsers");
const controllerU = new controllerUsers();
const multer = require("multer");
const multerStorage = multer.diskStorage({
    destination: path.join(__dirname, "../public/img/profile_imgs"),
    filename: (request, file, cb) =>{
        cb(null, file.originalname);
    }
});
const multerFactory = multer({
    dest: path.join(__dirname, "../public/img/profile_imgs"),
    storage: multerStorage
});

routerUsers.get("/", controllerU.identificacionRequerida, controllerU.listar_users);

routerUsers.post("/login", controllerU.login);

routerUsers.get("/imagenUsuario", controllerU.identificacionRequerida, controllerU.imagenUsuario);

routerUsers.post("/formular_cuenta", multerFactory.single("image"), controllerU.formular_cuenta);

routerUsers.get("/listar_users", controllerU.identificacionRequerida, controllerU.listar_users);

routerUsers.post("/usersByText", controllerU.identificacionRequerida, controllerU.getUsersByText);

routerUsers.get("/perfil_user/:id", controllerU.identificacionRequerida, controllerU.getPerfilUser);

module.exports = routerUsers;