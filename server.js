let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let db = [];

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('images'));
app.use(express.static('css'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
});

app.get('/addNewTask', function(req, res){
    res.sendFile(__dirname + '/addTask.html')
});

app.post('/taskAdded', function(req,res){
    db.push(req.body);
    console.log(req.body);
    res.sendFile(__dirname + '/post.html');
});

app.get('/listAllTasks', function(req,res){
    res.render('listTasks.html', {data: db});
});

app.listen(8080);