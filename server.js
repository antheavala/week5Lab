let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let db;
let viewsPath = __dirname +"/views";

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017/';

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
        console.log('Error', err);
    } 
    else {
        console.log("Connected successfully to server");
        db = client.db('tasksDb');
        db.collection('tasks');
    }
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('images'));
app.use(express.static('css'));

//GET REQUESTS

app.get('/', function(req, res){
    res.sendFile(viewsPath + '/home.html');
});

app.get('/addNewTask', function(req, res){
    res.sendFile(viewsPath + '/addTask.html')
});

app.get('/deleteTask', function(req, res){
    res.sendFile(viewsPath + '/deleteTask.html')
});

app.get('/deleteCompleted', function(req, res){
    db.collection('tasks').deleteMany({taskStatus : "Complete"}, function(err, obj){
        res.redirect('/listAllTasks');
    });
});

app.get('/listAllTasks', function(req,res){
    db.collection("tasks").find({}).toArray(function (err, result) {
        res.render('listTasks.html', {data: result});
      });
});

app.get('/updateTask', function(req, res){
    res.sendFile(viewsPath + '/updateTask.html')
});

//POST REQUESTS

app.post('/taskAdded', function(req,res){
    db.collection('tasks').insertOne(req.body);
    res.redirect('/listAllTasks');
});

app.post('/taskDeleted', function(req,res){
    let taskDetails = req.body;
    let filter = { _id : new mongodb.ObjectId(taskDetails.taskID)}
    db.collection('tasks').deleteOne(filter);
    res.redirect('/listAllTasks');
});

app.post('/updatedTask', function (req,res) {
    let newID = new mongodb.ObjectId(req.body.taskID)
    db.collection('tasks').updateOne({_id : newID}, {$set: {taskStatus : req.body.taskStatus}}, {upsert:false}, function(err,result){
        res.redirect('/listAllTasks');
    });
});

app.listen(8080);