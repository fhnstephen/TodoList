var fs = require('fs'),
    http = require('http'),
    express = require('express'),
    app = express(),
    path = require('path'),
    dataPath = '../data.json';


function getTodosFrom(pathname, callback) {
    fs.readFile(pathname, "utf8", function (err, data) {
       if (err) {
           callback(err);
           return;
       } else {
           try {
               data = JSON.parse(data);
               callback(null, data);
           }
           catch (err) {
               console.log(err.message);
           }
           return;
       }
    });
}

function writeTodosTo(pathname, todos, callback) {
    try {
        fs.writeFileSync(pathname, JSON.stringify(todos));
    }
    catch (err){
        callback(err);
    }
    callback(null);
    return;
}

function getTodos(req, res) {
    getTodosFrom(dataPath, function(err, data) {
        if (err) {
            res.send(err.message);
        } else {
            res.send(JSON.stringify(data));
        }
        return;
    });
}

function addTodo(req, res) {
    getTodosFrom(dataPath, function(err, data) {
        if (err) {
            res.status(400);
            res.send(err.message);
            res.end();
        } else {
            var newTodo = req.query;
            console.log(newTodo);
            data.push(newTodo);
            console.log(data);
            writeTodosTo(dataPath, data, function(err) {
                if (err) {
                    res.status(400);
                    res.send(err.message);
                    res.end();
                } else {
                    res.status(200);
                    res.end();
                }
            });
        }
        return;
    })
}

function deleteTodo(req, res) {
    getTodosFrom(dataPath, function(err, data) {
        if (err) {
            res.status(400);
            res.send(err.message);
            res.end();
        } else {
            var index = req.param('index');
            data.splice(index, 1);
            writeTodosTo(dataPath, data, function (err) {
                if (err) {
                    res.status(400);
                    res.send(err.message);
                    res.end();
                } else {
                    res.status(200);
                    res.end();
                }
            });
        }
    });
}

function editTodo(req, res) {
    getTodosFrom(dataPath, function(err, data) {
       if (err) {
           res.status(400);
           res.send(err.message);
           res.end();
       } else {
           var index = req.param('index');
           var todo = JSON.parse(req.param('todo'));
           console.log(todo);
           data[index] = todo;
           writeTodosTo(dataPath, data, function (err) {
               if (err) {
                   res.status(400);
                   res.send(err.message);
                   res.end();
               } else {
                   res.status(200);
                   res.end();
               }
           });
       }
    });
}

function main(argv) {
    // get first argument as port
    var port = argv[0] || 1234;
    app.use('/get-todos', getTodos);
    app.use('/add-todo', addTodo);
    app.use('/delete-todo', deleteTodo);
    app.use('/edit-todo', editTodo);
    app.use('/', express.static(__dirname + '/../'));
    app.listen(port);
}

main(process.argv.slice(2));
