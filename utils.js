'use strict'

let listaTareas = [
    { text: "Preparar práctica AW", tags: ["AW", "practica"] },
    { text: "Mirar fechas congreso", done: true, tags: [] },
    { text: "Ir al supermercado", tags: ["personal"] },
    { text: "Mudanza", done: false, tags: ["personal"] }
];

//ejercicio1
function getToDoTasks(array){
    return array.map(n => n.text);
}
//console.log(getToDoTasks(listaTareas))
//devuelve el siguiente array:
//[ 'Preparar práctica AW', 'Ir al supermercado', 'Mudanza' ]

//ejercicio2
function findByTag(tasks, tag){
    return tasks.filter(o => o.tags == tag);
}

//console.log(findByTag(listaTareas, "personal"));
//devuelve el siguiente array:
//[{ text: 'Ir al supermercado', tags: [ 'personal' ] },
//{ text: 'Mudanza', done: false, tags: [ 'personal' ] } ]

//ejercicio3
function findByTags(tasks, tags){
    return tasks.filter(o => o.tags.some(n => tags.some(m => m == n)));
}

//console.log(findByTags(listaTareas, ["practica", "personal"]));
//devuelve el siguiente array:
//[
//    { text: 'Preparar práctica AW', tags: [ 'AW', 'practica' ] }, { text: 'Ir al supermercado', tags: [ 'personal' ] },
//    { text: 'Mudanza', done: false, tags: [ 'personal' ] }
//    ]

//ejercicio4
function countDone(tasks){
    return tasks.filter(o => o.done == true).length;
}
//console.log(countDone(listaTareas));

//ejercicio5
function createTask(texto){
    var array = texto.split(" ");
    
    let t = (array.filter(n => n[0] != '@')).join(" ");
    let x = (array.filter(n => n.startsWith('@'))).map(m => m.substr(1));

    return {text: t, tags: x};
}

//console.log(createTask("Ir al medico @personal @salud"));
//devuelve el siguiente objeto:
//{ text: 'Ir al médico', tags: [ ‘personal', 'salud' ] }

//console.log(createTask("@AW @practica Preparar práctica AW"));
//devuelve el siguiente objeto:
//{ text: 'Preparar práctica AW', tags: [ ‘AW', 'practica' ] }

//console.log(createTask("Ir a @deporte entrenar"));
//devuelve el siguiente objeto:
//{ text: 'Ir a entrenar', tags: [ 'deporte' ] }