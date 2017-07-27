const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const messages = [];
const members = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/script.js');
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('chat message', (msg) => {
        messages.push(msg);
        io.emit('chat message', msg);
    });

    socket.on('chat members', (msg) => {
        members.push(msg);
        if (messages.length > 100) {
            messages.shift(req.body);
        }
        io.emit('chat members', msg);
    });

    socket.emit('chat history', messages);
});

http.listen(3000, () => {
    console.log('listening on: 3000');
});