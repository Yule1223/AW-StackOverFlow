"use strict";

const path = require("path");
const config = require("../config");
const mysql = require("mysql");
const moment = require('moment');
const today = moment();
const pool = mysql.createPool(config.mysqlConfig);
const modelQuestions = require("../models/modelQuestions");
const modelQ = new modelQuestions(pool);
const modelUsers = require("../models/modelUsers");
const { nextTick } = require("process");
const modelU = new modelUsers(pool);

class controllerQuestions{

listar_questions_todas(request, response){
    modelQ.getAllQuestions(cb_getQuestions);

    function cb_getQuestions(err, result, info){
        if (err) {
            response.status(500);
            next(err);
        } else{
            response.status(200);
            let questionList = [];

            if(info !== undefined)
                questionList = info;

            let title = "Todas las preguntas";
            response.render("listar_questions", { title: title, questionList: questionList});
        }
    }
}

formular_question(request, response){
    var title = request.body.title;
    var text = request.body.text;
    if(request.body.tags.includes(" ")){
        response.render("formular_question", {errorMsg: "Formato de etiquetas incorrecto"});
    }else{
    var lowerCase = request.body.tags.toLowerCase();
    var tags = lowerCase.split("@");
    if(tags.length > 5){
        response.render("formular_question", {errorMsg: "Máximo 5 etiquetas"});
    }
    else{
    tags.shift();
    let array = [];

    tags.forEach(element => {
        if(!array.includes(element))
            array.push(element);
    });

    var newQuestion = {
        title: title,
        text: text,
        done: 0,
        tags: array,
        date: today.format('YYYY-MM-DD')
    }

    modelQ.insertQuestion(response.locals.userEmail, newQuestion, cb_insertQuestion);

    function cb_insertQuestion(err){
        if (err) {
            response.status(500); 
            next(err);
        } 
        else{
            response.redirect("/preguntas/listar_questions/todas");
        }
    }
    }
    }
}

questionsByTag(request, response){
    modelQ.getQuestionsByTag(request.params.tag, cb_getQuestionsByTag);

    function cb_getQuestionsByTag(err, result, info){
        if (err) {
            response.status(500);
            next(err);
        } else{
            response.status(200);
            let questionList = [];

            if(info !== undefined)
                questionList = info;

            let title = `Preguntas con la etiqueta [${request.params.tag}]`;
            response.render("listar_questions", { title: title, questionList: questionList});
        }
    }
}

questionsByText(request, response){
    modelQ.getQuestionsByText("%"+request.body.filtrotext+"%", cb_getQuestionsByText);

    function cb_getQuestionsByText(err, result, info){
        if (err) {
            response.status(500);
            next(err);
        } else{
            response.status(200);
            let questionList = [];

            if(info !== undefined)
                questionList = info;
    
            let title = `Resultados de la búsqueda "${request.body.filtrotext}"`;
            response.render("listar_questions", { title: title, questionList: questionList});
        }
    }
}   

sin_responder(request, response){
    modelQ.getAllQuestions0Answers(cb_getQuestions0Answers);

    function cb_getQuestions0Answers(err, result, info){
        if (err) {
            response.status(500);
            next(err);
        } else{
            response.status(200);
            let questionList = [];

            if(info !== undefined)
                questionList = info;

            let title = "Preguntas sin responder";
            response.render("listar_questions", { title: title, questionList: questionList});
        }
    }
}

oneQuestion(request, response){
    modelQ.getOneQuestionById(request.params.id, response.locals.userEmail, cb_getOneQuestionById);

    function cb_getOneQuestionById(err, result, info){
        if (err) {
            response.status(500);
            next(err);
        } else{
            let questionList = [];
            
            if(!result){
                response.status(404);
                response.render("error404", { url: request.url });
            }
            else{
            response.status(200);
            questionList = info;
            var tags = [];
            var answers =[];
            var pregunta = {};
            questionList.forEach(function(question){

                var index = tags.findIndex(x => x==question.question_tag); 
                if(index === -1)
                    tags.push(question.question_tag)
                var index2 = answers.findIndex(x => x.id==question.answer_id); 
                if(index2 === -1){
                    let answer={
                        id: question.answer_id,
                        user: question.answer_user,
                        username: question.answer_username,
                        userid: question.answer_userid,
                        text: question.answer_text,
                        date: question.answer_date,
                        votos: question.answer_votos,
                        userimg: question.answer_userimg
                    }
                    answers.push(answer);
                }
                pregunta={
                    id: question.question_id,
                    user: question.question_user,
                    username: question.question_username,
                    userid: question.question_userid,
                    title: question.question_title,
                    text: question.question_text,
                    date: question.question_date,
                    votos: question.question_votos,
                    userimg: question.question_userimg,
                    tags: tags,
                    visit: question.question_visit
                }
            });
            
            if(pregunta.visit>=2){
                var metal="";
                var name1="";
                if(pregunta.visit<4){
                    name1="Pregunta popular";
                    metal="bronce";
                }
                else if(pregunta.visit<6){
                    name1="Pregunta destacada";
                    metal="plata";
                }
                else{
                    name1="Pregunta famosa";
                    metal="oro";
                }
                
                let info1={name: name1, metal: metal, user: pregunta.user, questionid: pregunta.id, date: today.format('YYYY-MM-DD')};
                modelU.insertAwardQuestion(info1, cd_insertAwardQuestion);
                function cd_insertAwardQuestion(err5, result){
                if(err5){
                    response.status(500); 
                    next(err5);
                }
                else
                    response.render("listar_questionsById", {answers: answers, pregunta: pregunta});
                }
            }
            else
                response.render("listar_questionsById", {answers: answers, pregunta: pregunta});
            }
        }
    }
}

send_respuesta(request, response){
    let date = today.format('YYYY-MM-DD');
    modelQ.insertAnswer(response.locals.userEmail, request.params.questionid, request.body.tuRespuesta, date, cb_insertAnswer);

    function cb_insertAnswer(err){
        if (err) {
            response.status(500); 
            next(err);
        } 
        else{
            response.redirect("/preguntas/listar_questions/todas");
        }
    }

}

addPointPregunta(request, response){
    let id = request.params.questionid;
    let user = response.locals.userEmail;
    modelQ.getQuestionVote(id, user, cb_getQuestionVote);

    function cb_getQuestionVote(err, result, info){
        if (err) {
            response.status(500); 
            next(err);
        } 
        else{
            console.log(info);
            if(info===undefined){
                modelU.insertVotoQuestion(id, user, cb_insertVotoQuestion);
                function cb_insertVotoQuestion(err1){
                    if (err1) {
                        response.status(500); 
                        next(err1);
                    } 
                    else{
                        modelQ.addPointQuestion(id, cb_addPointQuestion);

                        function cb_addPointQuestion(err2){
                        if (err2) {
                            response.status(500); 
                            next(err2);
                        } 
                        else{
                            modelU.checkQuestionAwards(id, cd_checkQuestionAwards);
                            function cd_checkQuestionAwards(err3, ok, info1){
                                if(err3){
                                    response.status(500); 
                                    next(err3);
                                }
                                else{
                                    if(ok){
                                        info1.date = today.format('YYYY-MM-DD');
                                        info1.questionid = id;
                                        modelU.insertAwardQuestion(info1, cd_insertAwardQuestion);
                                        function cd_insertAwardQuestion(err4, result){
                                            if(err4){
                                                response.status(500);
                                                next(err4); 
                                            }
                                            else{
                                                response.redirect("/preguntas/1question/"+id);
                                            }
                                        }}
                                    else   
                                        response.redirect("/preguntas/1question/"+id);
                                }
                            }
                        }
                        }
                    }
                }
            }
            else{
                if(info[0].hands_up>=1){
                    response.redirect("/preguntas/1question/"+id);
                }
                else{
                    modelQ.addPointQuestion(id, cb_addPointQuestion);

                    function cb_addPointQuestion(err4){
                    if (err4) {
                        response.status(500); 
                        next(err4);
                    } 
                    else{
                        modelU.checkQuestionAwards(id, cd_checkQuestionAwards);
                            function cd_checkQuestionAwards(err3, ok, info1){
                                if(err3){
                                    response.status(500); 
                                    next(err3);
                                }
                                else{
                                    if(ok){
                                        info1.date=today.format('YYYY-MM-DD');
                                        info1.questionid = id;
                                        modelU.insertAward(info1, cd_insertAward);
                                        function cd_insertAward(err5, result){
                                            if(err5){
                                                response.status(500);
                                                next(err5); 
                                            }
                                            else{
                                                response.redirect("/preguntas/1question/"+id);
                                            }
                                    }}
                                    else   
                                        response.redirect("/preguntas/1question/"+id);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

deletePointPregunta(request, response){
    let id = request.params.questionid;
    let user = response.locals.userEmail;
    modelQ.getQuestionVote(id, user, cb_getQuestionVote);

    function cb_getQuestionVote(err, result, info){
        if (err) {
            response.status(500); 
            next(err);
        } 
        else{
            if(info===undefined){
                modelU.insertVotoQuestion(id, user, cb_insertVotoQuestion);
                function cb_insertVotoQuestion(err1){
                    if (err1) {
                        response.status(500); 
                        next(err1);
                    } 
                    else{
                        modelQ.deletePointQuestion(id, cb_deletePointQuestion);

                        function cb_deletePointQuestion(err2){
                        if (err2) {
                            response.status(500);
                            next(err2); 
                        } 
                        else{
                            response.redirect("/preguntas/1question/"+id);
                        }
                        }
                    }
                }
            }
            else{
                if(info[0].hands_down===1){
                    response.redirect("/preguntas/1question/"+id);
                }
                else{
                    modelQ.deletePointQuestion(id, cb_deletePointQuestion);

                    function cb_deletePointQuestion(err3){
                    if (err3) {
                        response.status(500); 
                        next(err3);
                    } 
                    else{
                        response.redirect("/preguntas/1question/"+id);
                    }
                }
            }
            }
        }
    }
}

addPointRespuesta(request, response){
    let id = request.params.answerid;
    modelQ.getQuestionByAnswer(id, cb_getQuestionByAnswer);

    function cb_getQuestionByAnswer(err, result, info){
        if (err) {
            response.status(500); 
            next(err);
        } 
        else{
            let id_question = info[0].id_question;
            let user = response.locals.userEmail;
            modelQ.getAnswerVote(id, user, cb_getAnswerVote);

            function cb_getAnswerVote(err1, result1s, info1){
                if (err1) {
                    response.status(500); 
                    next(err1);
                } 
                else{
                    if(info1===undefined){
                        modelU.insertVotoAnswer(id, user, cb_insertVotoAnswer);
                        function cb_insertVotoAnswer(err2){
                            if (err2) {
                                response.status(500); 
                                next(err2);
                            } 
                            else{
                                modelQ.addPointAnswer(id, cb_addPointAnswer);
        
                                function cb_addPointAnswer(err3){
                                if (err3) {
                                    response.status(500);
                                    next(err3); 
                                } 
                                else{
                                    modelU.checkAnswerAwards(id, cd_checkAnswerAwards);
                                    function cd_checkAnswerAwards(err4, ok, info1){
                                    if(err4){
                                        response.status(500); 
                                        next(err4);
                                    }
                                    else{
                                        if(ok){
                                            info1.date = today.format('YYYY-MM-DD');
                                            info1.answerid = id;
                                            modelU.insertAwardAnswer(info1, cd_insertAwardAnswer);
                                            function cd_insertAwardAnswer(err5, result){
                                            if(err5){
                                                response.status(500); 
                                                next(err5);
                                            }
                                            else{
                                                response.redirect("/preguntas/1question/"+id_question);
                                        }}}
                                        else
                                            response.redirect("/preguntas/1question/"+id_question);
                                    }
                                }
                            }
                                }
                            }
                        }
                    }
                    else{
                        if(info1[0].hands_up===1){
                            response.redirect("/preguntas/1question/"+id_question);
                        }
                        else{
                            modelQ.addPointAnswer(id, cb_addPointAnswer);
                            function cb_addPointAnswer(err7){
                            if (err7) {
                                response.status(500); 
                                next(err7);
                            } 
                            else{
                                modelU.checkAnswerAwards(id, cd_checkAnswerAwards);
                                function cd_checkAnswerAwards(err8, ok, info1){
                                if(err8){
                                    response.status(500); 
                                    next(err8);
                                }
                                else{
                                    if(ok){
                                        info1.date = today.format('YYYY-MM-DD');
                                        info1.answerid = id;
                                        modelU.insertAward(info1, cd_insertAwardAnswer);
                                        function cd_insertAwardAnswer(err9, result){
                                        if(err9){
                                            response.status(500); 
                                            next(err9);
                                        }
                                        else{
                                            response.redirect("/preguntas/1question/"+id_question);
                                        }
                                    }}
                                    else
                                        response.redirect("/preguntas/1question/"+id_question);
                                }
                                }
                            }       
                            }
                  }   }}       
            }
        }
    }
}

deletePointRespuesta(request, response){
    let id = request.params.answerid;
    modelQ.getQuestionByAnswer(id, cb_getQuestionByAnswer);

    function cb_getQuestionByAnswer(err, result, info){
        if (err) {
            response.status(500); 
            next(err);
        } 
        else{
            let id_question = info[0].id_question;
            let user = response.locals.userEmail;
            modelQ.getAnswerVote(id, user, cb_getAnswerVote);

            function cb_getAnswerVote(err1, result, info1){
                if (err1) {
                    response.status(500); 
                    next(err1);
                } 
                else{
                    if(info1===undefined){
                        modelU.insertVotoAnswer(id, user, cb_insertVotoAnswer);
                        function cb_insertVotoAnswer(err2){
                            if (err2) {
                                response.status(500); 
                                next(err2);
                            } 
                            else{
                                modelQ.deletePointAnswer(id, cb_deletePointAnswer);
        
                                function cb_deletePointAnswer(err3){
                                if (err3) {
                                    response.status(500); 
                                    next(err3);
                                } 
                                else{
                                    response.redirect("/preguntas/1question/"+id_question);
                                }
                                }
                            }
                        }
                    }
                    else{
                        if(info1[0].hands_down===1){
                            response.redirect("/preguntas/1question/"+id_question);
                        }
                        else{
                            modelQ.deletePointAnswer(id, cb_deletePointAnswer);
        
                            function cb_deletePointAnswer(err4){
                            if (err4) {
                                response.status(500);
                                next(err4); 
                            } 
                            else{
                                response.redirect("/preguntas/1question/"+id_question);
                            }
                            }
                        }
                    }
                } 
            }
        }
    }
}
}
module.exports=controllerQuestions;
