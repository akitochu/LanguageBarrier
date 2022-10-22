var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('react-client/build'))

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

let userCount = 0;

io.on('connection', (socket) => {
  console.log('User Online');
  socket.on('send-username', (username) => {
    userCount += 1;
    console.log(userCount);
    socket.broadcast.emit('new-user', userCount);
  });
  socket.on('codeboard-message', (msg) => {
    console.log('message: ' + msg);
	socket.broadcast.emit('message-from-others', msg);
  });
  
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
http.listen(server_port, () => {
  console.log('listening on *:' + server_port);
});

