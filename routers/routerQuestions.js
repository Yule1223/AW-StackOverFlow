"use strict";

const express = require("express");
const routerQuestions = express.Router();
const controllerQuestions = require("../controllers/controllerQuestions");
const controllerQ = new controllerQuestions();
const controllerUsers = require("../controllers/controllerUsers");
const controllerU = new controllerUsers();

routerQuestions.get("/", controllerU.identificacionRequerida, controllerQ.listar_questions_todas); 

routerQuestions.get("/listar_questions/todas", controllerU.identificacionRequerida, controllerQ.listar_questions_todas); 

routerQuestions.get("/ir_a_formular", controllerU.identificacionRequerida, function(request, response) {
    response.status(200);
    response.render("formular_question", {errorMsg: null});
});

routerQuestions.post("/formular_question", controllerU.identificacionRequerida, controllerQ.formular_question); 

routerQuestions.get("/questionsByTag/:tag", controllerU.identificacionRequerida, controllerQ.questionsByTag);

routerQuestions.post("/questionsByText", controllerU.identificacionRequerida, controllerQ.questionsByText);

routerQuestions.get("/sin_responder", controllerU.identificacionRequerida, controllerQ.sin_responder); 

routerQuestions.get("/1question/:id", controllerU.identificacionRequerida, controllerQ.oneQuestion); 

routerQuestions.post("/send_respuesta/:questionid", controllerU.identificacionRequerida, controllerQ.send_respuesta);

routerQuestions.get("/addPointPregunta/:questionid", controllerU.identificacionRequerida, controllerQ.addPointPregunta); 

routerQuestions.get("/deletePointPregunta/:questionid", controllerU.identificacionRequerida, controllerQ.deletePointPregunta);

routerQuestions.get("/addPointRespuesta/:answerid", controllerU.identificacionRequerida, controllerQ.addPointRespuesta);

routerQuestions.get("/deletePointRespuesta/:answerid", controllerU.identificacionRequerida, controllerQ.deletePointRespuesta);

module.exports = routerQuestions;