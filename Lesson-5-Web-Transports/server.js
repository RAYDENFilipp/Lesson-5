const app = require('express')();
//const http = require('http').Server(app);
const bodyParser = require('body-parser');

const messages = [];
const members = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', function(req, res) {
    res.sendFile(__dirname + '/script.js');
});

app.get('/messages', function(req, res) {
    res.json(messages);
});

app.post('/messages', function(req, res) {
    messages.push(req.body);
    if (messages.length > 100) {
        messages.shift();
    }
});

app.get('/members', function(req, res) {
    res.json(members);
});

app.get('/members/name', function(req, res) {
    res.json(members[ members.indexOf( req.body ) ]);
});

app.post('/members', function(req, res) {
    if (members.indexOf(req.body) !== -1) {
        res.send('This name is already used');
    } else {
        members.push(req.body);
    }

});

app.put('/members', function(req, res) {
  members.filter((val) => val !== req.body);
});

app.listen(3000);