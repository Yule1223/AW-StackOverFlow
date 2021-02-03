"use strict";

class modelUsers {

constructor(pool) {  
    this.pool=pool;
}

isUserCorrect(email, password, callback) {
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
            connection.query(sql, [email,password], function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); //no está el usuario con el password proporcionado
                    }
                    else {
                        callback(null, true, rows[0]);
                    }           
                }
            });
        }
    });
}  

getUserImageName(email, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT img FROM user WHERE email = ?"
            connection.query( sql, [email], function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); //no está el usuario con el password proporcionado
                        }
                        else {
                            callback(null, true, rows[0].img);
                        }           
                    }
            });
        }
    }
    );
}

isUserExist(email, callback) {
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT * FROM user WHERE email = ?";
            connection.query(sql, [email], function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); //no está el usuario proporcionado
                    }
                    else {
                        callback(null, true);
                    }           
                }
            });
        }
    });
}  

insertUser(email, password, name, image, date, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "INSERT INTO user(email, password, name, img, date) VALUES (?, ?, ?, ?, ?)";
            connection.query( sql, [email, password, name, image, date], function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); 
                    }
                    else{
                        callback(null, true);
                    }
                }
            });
        }
    });
}

getAllUsers(callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT u.id_user AS id, u.email, u.name, u.img, u.reputation, GROUP_CONCAT(tag) AS tags FROM user u " + 
            "LEFT JOIN question ON question.user = u.email LEFT JOIN tag ON question.id = tag.questionid " + 
            "GROUP BY u.email";
            connection.query( sql, function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); //no está el usuario con el password proporcionado
                        }
                        else {
                            callback(null, true, rows);
                        }           
                    }
            });
        }
    }
    );
}

getUsersByText(text, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT email, name, img, reputation, GROUP_CONCAT(tag) AS tags FROM user " + 
            "LEFT JOIN question ON question.user = user.email LEFT JOIN tag ON question.id = tag.questionid " + 
            "WHERE UPPER(name) LIKE UPPER(?) GROUP BY email";
            connection.query( sql, [text], function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); //no está el usuario con el password proporcionado
                        }
                        else {
                            callback(null, true, rows);
                        }           
                    }
            });
        }
    }
    );
}

getUserPerfil(id, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT user.id_user AS id, name, img, user.date, reputation, (SELECT COUNT(user) FROM question LEFT JOIN user "+
            "ON user.email=question.user WHERE user.id_user=?) AS nQuestions, (SELECT COUNT(user) FROM answer LEFT JOIN"+
            " user ON user.email=answer.user WHERE user.id_user=?) AS nAnswers, (SELECT GROUP_CONCAT(a.name) from award "+
            "a LEFT JOIN user_award_question ua ON a.id=ua.award JOIN user u on u.email=ua.user WHERE u.id_user=?"+
            " AND a.metal='bronce') AS broncesQ, (SELECT GROUP_CONCAT(a.name) from award a LEFT JOIN user_award_answer"+
            " uan ON a.id=uan.award JOIN user u on u.email=uan.user WHERE u.id_user=? AND a.metal='bronce') AS "+
            "broncesA, (SELECT GROUP_CONCAT(a.name) from award a LEFT JOIN user_award_question ua ON a.id=ua.award "+
            "JOIN user u on u.email=ua.user WHERE u.id_user=? AND a.metal='plata') AS platasQ, (SELECT GROUP_CONCAT(a.name) "+
            "from award a LEFT JOIN user_award_answer uan ON a.id=uan.award JOIN user u on u.email=uan.user WHERE "+
            "u.id_user=? AND a.metal='plata') AS platasA, (SELECT GROUP_CONCAT(a.name) from award a LEFT JOIN "+
            "user_award_question ua ON a.id=ua.award JOIN user u on u.email=ua.user WHERE u.id_user=? AND a.metal='oro') "+
            "AS orosQ, (SELECT GROUP_CONCAT(a.name) from award a LEFT JOIN user_award_answer uan ON a.id=uan.award "+
            "JOIN user u on u.email=uan.user WHERE u.id_user=? AND a.metal='oro') AS orosA FROM user WHERE id_user= ?";
            connection.query( sql, [id, id, id, id, id, id, id, id, id], function(err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); //no está el usuario con el password proporcionado
                        }
                        else {
                            callback(null, true, rows[0]);
                        }           
                    }
            });
        }
    }
    );
}

checkQuestionAwards(questionid, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT points, user FROM question WHERE id = ? AND points >= 1";
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
                        var name="";
                        var metal="";
                        if(rows[0].points<2){
                            name="Estudiante";
                            metal="bronce";
                        }
                        else if(rows[0].points<4){
                            name="Pregunta interesante";
                            metal="bronce";
                        }
                        else if(rows[0].points<6){
                            name="Buena pregunta";
                            metal="plata";
                        }
                        else{
                            name="Excelente pregunta";
                            metal="oro";
                        }
                        let info={name: name, metal: metal, user: rows[0].user};
                        callback(null, true, info);
                    }          
                }
            });
        }
    });
}

checkAnswerAwards(answerid, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "SELECT points, user FROM answer WHERE id = ? AND points >= 2";
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
                        var name="";
                        var metal="";
                        if(rows[0].points<4){
                            name="Respuesta interesante";
                            metal="bronce";
                        }
                        else if(rows[0].points<6){
                            name="Buena respuesta";
                            metal="plata";
                        }
                        else{
                            name="Excelente respuesta";
                            metal="oro";
                        }
                        let info={name: name, metal: metal, user: rows[0].user};
                        callback(null, true, info);
                    }          
                }
            });
        }
    });
}

insertAwardQuestion(info, callback){
    this.pool.getConnection(function(err, connection) {
        if (err)
            callback(new Error("Error de conexión a la base de datos"));
        else {
            const sql = "SELECT* FROM user_award_question LEFT JOIN award ON award=id WHERE name = ? AND question_id = ?";
                connection.query( sql, [info.name, info.questionid], function(err1, rows) {
                if (err1) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if(rows.length!==0)
                        callback(null, true);
                    else{
                        const sql2 = "INSERT INTO award(metal, name) VALUES(?, ?)";
                        connection.query( sql2, [info.metal, info.name], function(err2, rows1) {
                        if (err2)
                            callback(new Error("Error de acceso a la base de datos"));
                        else {
                            if (rows1.length === 0)
                                callback(null, false); 
                            else { 
                            const sql3 = "INSERT INTO user_award_question(user, award, date, question_id) VALUES (?, ?, ?, ?)";
                            connection.query( sql3, [info.user, rows1.insertId, info.date, info.questionid], function(err3, rows2) {
                            connection.release(); // devolver al pool la conexión
                            if (err3)
                                callback(new Error("Error de acceso a la base de datos"));
                            else
                                callback(null, true);           
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

insertAwardAnswer(info, callback){
    this.pool.getConnection(function(err, connection) {
        if (err)
            callback(new Error("Error de conexión a la base de datos"));
        else {
            const sql = "SELECT* FROM user_award_answer LEFT JOIN award ON award=id WHERE name = ? AND answer_id = ?";
                connection.query( sql, [info.name, info.answerid], function(err1, rows) {
                if (err1) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if(rows.length!==0)
                        callback(null, true);
                    else{
                        const sql2 = "INSERT INTO award(metal, name) VALUES(?, ?)";
                        connection.query( sql2, [info.metal, info.name], function(err2, rows1) {
                        if (err2)
                            callback(new Error("Error de acceso a la base de datos"));
                        else {
                            if (rows1.length === 0)
                                callback(null, false); 
                            else { 
                            const sql3 = "INSERT INTO user_award_answer(user, award, date, answer_id) VALUES (?, ?, ?, ?)";
                            connection.query( sql3, [info.user, rows1.insertId, info.date, info.answerid], function(err3, rows2) {
                            connection.release(); // devolver al pool la conexión
                            if (err3)
                                callback(new Error("Error de acceso a la base de datos"));
                            else
                                callback(null, true);           
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

insertVotoAnswer(answerid, user, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "INSERT INTO vote_answer(user, id_answer) VALUES(?, ?)";
            connection.query( sql, [user, answerid], function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); 
                    }
                    else { 
                        callback(null, true);
                    }          
                }
            });
        }
    });
}

insertVotoQuestion(questionid, user, callback){
    this.pool.getConnection(function(err, connection) {
        if (err) { 
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            const sql = "INSERT INTO vote_question(user, id_question) VALUES(?, ?)";
            connection.query( sql, [user, questionid], function(err, rows) {
                connection.release(); // devolver al pool la conexión
                if (err) {
                    callback(new Error("Error de acceso a la base de datos"));
                }
                else {
                    if (rows.length === 0) {
                        callback(null, false); 
                    }
                    else { 
                        callback(null, true);
                    }          
                }
            });
        }
    });
}
}
module.exports = modelUsers;
