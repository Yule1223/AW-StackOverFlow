"use strict";

class modelQuestions{
    
constructor(pool) {  
    this.pool=pool;
}

getAllQuestions(callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT user.id_user, id, user, title, text, question.date, name, img, GROUP_CONCAT(DISTINCT tag) AS tags FROM question " + 
            "LEFT JOIN tag ON question.id = tag.questionid JOIN user ON question.user = user.email GROUP BY id ORDER BY question.date DESC, question.id DESC";
            connection.query( sql, function(err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            }
            else {
                if (rows.length === 0) {
                    callback(null, false); 
                }
                else {
                    callback(null, true, rows);
                }           
            }
            });
        }
    });
}

insertQuestion(email, question, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "INSERT INTO question(user, title, text, date) VALUES (?, ?, ?, ?)";
            connection.query( sql, [email, question.title, question.text, question.date], function(err, rows) {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); 
                    }
                    else if(question.tags.length != 0){ //tarea con tags
                        const sql2 = "INSERT INTO tag (questionid, tag) VALUES ?";
                        let array =[];
                        question.tags.forEach(element => {
                            array.push([rows.insertId, element]);
                        });
                        connection.query( sql2, [array], function(err1, rows1) {
                        connection.release(); // devolver al pool la conexión 
                        if (err1) {
                            console.log(err1);
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, true);           
                        }
                        });
                    }
                    else{//tarea sin tags
                        callback(null, true);
                    }           
                }
            });
        }
    });
}

getQuestionsByText(text, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT user.id_user, id, user, title, text, question.date, name, img, GROUP_CONCAT(DISTINCT tag) AS tags " + 
            "FROM question LEFT JOIN tag ON question.id = tag.questionid JOIN user ON question.user = user.email " +
            "WHERE id IN(SELECT id FROM question LEFT JOIN tag ON question.id = tag.questionid " + 
            "JOIN user ON question.user = user.email WHERE text LIKE ? GROUP BY id) GROUP BY id ORDER BY question.date DESC";
            connection.query( sql, [text], function(err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            }
            else {
                if (rows.length === 0) {
                    callback(null, false); 
                }
                else {
                    callback(null, true, rows);
                }           
            }
            });
        }
    });
}

getQuestionsByTag(tag, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT user.id_user, id, user, title, text, question.date, name, img, GROUP_CONCAT(DISTINCT tag) AS tags " + 
            "FROM question LEFT JOIN tag ON question.id = tag.questionid JOIN user ON question.user = user.email " +
            "WHERE id IN(SELECT id FROM question LEFT JOIN tag ON question.id = tag.questionid " + 
            "JOIN user ON question.user = user.email WHERE tag LIKE ? GROUP BY id) GROUP BY id ORDER BY question.date DESC";
            connection.query( sql, [tag], function(err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            }
            else {
                if (rows.length === 0) {
                    callback(null, false); 
                }
                else {
                    callback(null, true, rows);
                }  
            }
            });
        }
    });
}

getAllQuestions0Answers(callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT user.id_user, id, user, title, text, question.date, name, img, GROUP_CONCAT(DISTINCT tag) AS tags FROM " + 
            "question LEFT JOIN tag ON question.id = tag.questionid JOIN user ON question.user = user.email " + 
            "WHERE id NOT IN (SELECT id_question FROM user_answer) GROUP BY id ORDER BY question.date DESC, question.id DESC;";
            connection.query( sql, function(err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            }
            else {
                if (rows.length === 0) {
                    callback(null, false); 
                }
                else {
                    callback(null, true, rows);
                }           
            }
            });
        }
    });
}

getOneQuestionById(id, email, callback){
    this.pool.getConnection(function(err, connection) {
        if (err)
            callback(new Error("Error de conexión a la base de datos"));
        else {
            const sql6 = "SELECT* FROM question WHERE id = ?";
            connection.query( sql6, [id], function(err6, rows6) {
            if (err6)
                callback(new Error("Error de acceso a la base de datos"));
            else {
                if(rows6.length === 0)
                    callback(null, false);
                else{
                    const sql = "SELECT* FROM user_visit WHERE id_question = ? AND user= ?";
                    connection.query( sql, [id, email], function(err, rows1) {
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else {
                        if (rows1.length === 0) {
                            const sql2 = "INSERT INTO user_visit(id_question, user) VALUES(?, ?)";
                            connection.query( sql2, [id, email], function(err2, rows2) {
                            if(err2)
                                callback(new Error("Error de acceso a la base de datos"));
                            else{
                                const sql3 = "UPDATE question SET visit = visit + 1 WHERE id = ?";
                                connection.query( sql3, [id], function(err3, rows3) {
                                if(err3)
                                    callback(new Error("Error de acceso a la base de datos"));
                                else{
                                    const sql5 = "SELECT q.id AS question_id, q.user AS question_user, u1.name AS question_username, u1.id_user AS question_userid, u1.img AS question_userimg, " + 
                                    "q.title AS question_title, q.text AS question_text, q.date AS question_date, (q.hands_up+q.hands_down) " + 
                                    "AS question_votos, q.visit AS question_visit, tag AS question_tag, a.id AS answer_id, a.user AS answer_user, u2.name AS " + 
                                    "answer_username, u2.id_user AS answer_userid, u2.img AS answer_userimg, a.text AS answer_text, a.date AS answer_date, (a.hands_up+a.hands_down) AS " + 
                                    "answer_votos FROM question q LEFT JOIN user_answer u ON q.id=u.id_question LEFT JOIN answer a ON " + 
                                    "a.id=u.id_answer LEFT JOIN user u1 ON u1.email=q.user LEFT JOIN user u2 ON u2.email=a.user " + 
                                    "LEFT JOIN tag ON q.id=tag.questionid WHERE q.id = ? ORDER BY a.date DESC";
                                    connection.query( sql5, [id], function(err5, rows5) {
                                    connection.release(); // devolver al pool la conexión
                                    if (err5)
                                        callback(new Error("Error de acceso a la base de datos"));
                                    else
                                        callback(null, true, rows5);           
                                    });      
                                }
                                }); 
                            }    
                            });
                        }
                        else{
                            const sql4 = "SELECT q.id AS question_id, q.user AS question_user, u1.name AS question_username, u1.id_user AS question_userid, u1.img AS question_userimg, " + 
                            "q.title AS question_title, q.text AS question_text, q.date AS question_date, (q.hands_up+q.hands_down) " + 
                            "AS question_votos, q.visit AS question_visit, tag AS question_tag, a.id AS answer_id, a.user AS answer_user, u2.name AS " + 
                            "answer_username, u2.id_user AS answer_userid, u2.img AS answer_userimg, a.text AS answer_text, a.date AS answer_date, (a.hands_up+a.hands_down) AS " + 
                            "answer_votos FROM question q LEFT JOIN user_answer u ON q.id=u.id_question LEFT JOIN answer a ON " + 
                            "a.id=u.id_answer LEFT JOIN user u1 ON u1.email=q.user LEFT JOIN user u2 ON u2.email=a.user " + 
                            "LEFT JOIN tag ON q.id=tag.questionid WHERE q.id = ? ORDER BY a.date DESC";
                            connection.query( sql4, [id], function(err4, rows4) {
                                connection.release(); // devolver al pool la conexión
                            if (err4)
                                callback(new Error("Error de acceso a la base de datos"));
                            else
                                callback(null, true, rows4);           
                            });      
                        }          
                    }
                    });
                }
            }
        });    
    }
}); 
}

addPointQuestion(questionid, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "UPDATE question SET hands_up = hands_up + 1, points = points + 1 WHERE id = ?";
            connection.query( sql, [questionid], function(err, rows) {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); 
                    }
                    else { 
                        const sql2 = "UPDATE user SET reputation = reputation + 10 WHERE email = (SELECT user FROM question WHERE id = ?)";
                        connection.query( sql2, [questionid], function(err1, rows1) {
                        if (err1) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            const sql3 = "UPDATE vote_question SET hands_up = hands_up + 1 WHERE id_question = ?";
                            connection.query( sql3, [questionid], function(err2, rows2) {
                            connection.release(); // devolver al pool la conexión 
                            if (err2) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                callback(null, true);
                            }
                            });
                        }
                        });
                    }          
                }
            });
        }
    });
}

deletePointQuestion(questionid, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "UPDATE question SET hands_down = hands_down + 1, points = points - 1 WHERE id = ?";
            connection.query( sql, [questionid], function(err, rows) {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false);
                    }
                    else { 
                        const sql2 = "UPDATE user SET reputation = (case when reputation - 2 <= 0 then 1 else reputation - 2 end) WHERE email = " + 
                        "(SELECT user FROM question WHERE id = ?)";
                        connection.query( sql2, [questionid], function(err1, rows1) {
                        if (err1) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            const sql3 = "UPDATE vote_question SET hands_down = hands_down + 1 WHERE id_question = ?";
                            connection.query( sql3, [questionid], function(err2, rows2) {
                            connection.release(); // devolver al pool la conexión 
                            if (err2) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                callback(null, true);
                            }
                            });       
                        }
                        });
                    }          
                }
            });
        }
    });
}

getQuestionByAnswer(answerid, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT id_question FROM user_answer WHERE id_answer = ?";
            connection.query( sql, [answerid], function(err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            }
            else {
                if (rows.length === 0) {
                    callback(null, false); 
                }
                else {
                    callback(null, true, rows);
                }  
            }
            });
        }
    });
}

getQuestionVote(questionid, user, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT hands_up, hands_down FROM vote_question WHERE id_question = ? AND user = ?";
            connection.query( sql, [questionid, user], function(err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            }
            else {
                if (rows.length === 0) {
                    callback(null, false);
                }
                else {
                    callback(null, true, rows);
                }  
            }
            });
        }
    });
}

insertAnswer(email, questionid, text, date, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "INSERT INTO answer(user, text, date) VALUES (?, ?, ?)";
            connection.query( sql, [email, text, date], function(err, rows) {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); 
                    }
                    else {
                        const sql2 = "INSERT INTO user_answer (id_question, id_answer) VALUES (?, ?)";
                        connection.query( sql2, [questionid, rows.insertId], function(err1, rows1) {
                        connection.release(); // devolver al pool la conexión 
                        if (err1) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null, true);           
                        }
                        });
                    }           
                }
            });
        }
    });
}

getAllAnswersOneQuestion(questionid, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT id, user, user.name AS username, text, answer.date, (hands_up+hands_down) AS " + 
            "votos, user.img AS userimg FROM user_answer LEFT JOIN answer ON answer.id=id_answer " + 
            "LEFT JOIN user ON answer.user=user.email WHERE id_question= ? ORDER BY answer.date DESC, answer.id DESC";
            connection.query( sql, [questionid], function(err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            }
            else {
                if (rows.length === 0) {
                    callback(null, false); 
                }
                else {
                    callback(null, true, rows);
                }           
            }
            });
        }
    });
}

addPointAnswer(answerid, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "UPDATE answer SET hands_up = hands_up + 1, points = points + 1 WHERE id = ?";
            connection.query( sql, [answerid], function(err, rows) {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); 
                    }
                    else { 
                        const sql2 = "UPDATE user SET reputation = reputation + 10 WHERE email = (SELECT user FROM answer WHERE id = ?)";
                        connection.query( sql2, [answerid], function(err1, rows1) {
                        if (err1) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            const sql3 = "UPDATE vote_answer SET hands_up = hands_up + 1 WHERE id_answer = ?";
                            connection.query( sql3, [answerid], function(err2, rows2) {
                            connection.release(); // devolver al pool la conexión
                            if (err2) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                callback(null, true);
                            }
                            });          
                        }
                        });
                    }          
                }
            });
        }
    });
}

deletePointAnswer(answerid, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "UPDATE answer SET hands_down = hands_down + 1, points = points - 1 WHERE id = ?";
            connection.query( sql, [answerid], function(err, rows) {
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); 
                    }
                    else { 
                        const sql2 = "UPDATE user SET reputation = reputation - 2 WHERE email = (SELECT user " + 
                        "FROM answer WHERE id = ?) AND reputation >= 3";
                        connection.query( sql2, [answerid], function(err1, rows1) {
                        if (err1) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            const sql3 = "UPDATE vote_answer SET hands_down = hands_down + 1 WHERE id_answer = ?";
                            connection.query( sql3, [answerid], function(err2, rows2) {
                            connection.release(); // devolver al pool la conexión
                            if (err2) {
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else {
                                callback(null, true);
                            }
                            });             
                        }
                        });
                    }          
                }
            });
        }
    });
}

getAnswerVote(answerid, user, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT hands_up, hands_down FROM vote_answer WHERE id_answer = ? AND user = ?";
            connection.query( sql, [answerid, user], function(err, rows) {
            connection.release(); // devolver al pool la conexión
            if (err) {
                callback(new Error("Error de acceso a la base de datos"));
            }
            else {
                if (rows.length === 0) {
                    callback(null, false);
                }
                else {
                    callback(null, true, rows);
                }  
            }
            });
        }
    });
}
}

module.exports = modelQuestions;