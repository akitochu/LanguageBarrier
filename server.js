var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('react-client/build'))

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

let userCount = 0;
let users = [];
let chatLog = [];

io.on('connection', (socket) => {
  socket.broadcast.emit('update-users', users)
  console.log('User Online');
  let thisUsername;
  socket.on('send-username', (username) => {
    socket.emit('check-for-updating-username', (username))
  });
  socket.on('new-username', (username) => {
    userCount += 1;
    users.push(username);
    thisUsername = username
    socket.emit('new-user', userCount, users)
    socket.broadcast.emit('new-user', userCount, users);
  });
  socket.on('update-username', (username, oldUsername) => {
    for (var i=0; i < users.length; i++){
      if (users[i] === oldUsername){
        users.splice(i, 1);
        i--;
      }
    }
    users.push(username);
    thisUsername = username
    socket.emit('new-user', userCount, users)
    socket.broadcast.emit('new-user', userCount, users);
  })
  socket.on('codeboard-message', (msg) => {
    if (msg === "uptodate") {
      console.log(chatLog)
      if (chatLog.length === 0){
        console.log("chatlog empty")
        return
      }else{
        console.log("gotinif")
        socket.emit('message-from-others', chatLog)
      }
    }else{
      chatLog.push(msg);
      console.log(msg);
      console.log(chatLog);
	    socket.broadcast.emit('message-from-others', msg);
    }
  });

  socket.on('add-translation', (message) => {
    console.log(message)
  })
  
  socket.on('disconnect', function(data) {
    for (var i=0; i < users.length; i++){
      if (users[i] === thisUsername){
        users.splice(i, 1);
        i--;
      }
    }
    socket.broadcast.emit('update-users', users)
  })
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
http.listen(server_port, () => {
  console.log('listening on *:' + server_port);
});

