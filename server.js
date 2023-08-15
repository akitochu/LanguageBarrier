
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var axios = require('axios');
const key = 'AIzaSyBMb5PxGr6kseebULyDBh0Xe7WeiM2I33k'

app.use(express.static('react-client/build'))

let usercount = 1234;

app.get('/usercount', (req, res) => {
    console.log("called")
    res.status(200).send({
        value: usercount,
    })
    usercount++;
});


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
    socket.emit('new-user', userCount, users, username)
    socket.broadcast.emit('new-user', userCount, users, username);
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
      if (chatLog.length === 0){
        return
      }else{
        socket.emit('message-from-others', chatLog, "chat log")
      }
    }else{
      chatLog.push(msg);
	    socket.broadcast.emit('message-from-others', msg, "msg");
    }
  });

  socket.on('add-translation', (message) => {
    console.log(message)
  })

  socket.on('translate', (language, originalMessage, username) => {
    axios.get('https://translation.googleapis.com/language/translate/v2?key='+key+'&format=text&target='+language+'&q='+originalMessage).then(res => {
    console.log(JSON.stringify(res.data))
    let translatedMessage = JSON.stringify(res.data.data.translations[0].translatedText);
    let formattedMessage = username + translatedMessage.slice(1,translatedMessage.length-1)
    let newTranslation = {
      language: language,
      message: translatedMessage
    }
    chatLog[chatLog.length-1].messageLanguagePairings.push(newTranslation)
    socket.emit('translated-message', formattedMessage)  
    }).catch(err=>{
      console.log(err)
      return
    }); 
  })


  async function translateAllMessages (newLanguage){
    if (chatLog.length > 0){
      for (let m=0; m < chatLog.length; m++){
        let languages = chatLog[m].messageLanguagePairings.map((obj) => obj.language)
        if (languages.includes(newLanguage)){
          let location = languages.indexOf(newLanguage)
          let formattedMessage = chatLog[m].username + chatLog[m].messageLanguagePairings[location].message
          socket.emit('translated-message', formattedMessage) 
        }else{
          axios.get('https://translation.googleapis.com/language/translate/v2?key='+key+'&format=text&target='+newLanguage+'&q='+chatLog[m].messageLanguagePairings[0].message, chatLog[m].username).then(res => {
            let translatedMessage = JSON.stringify(res.data.data.translations[0].translatedText);
            let formattedMessage = chatLog[m].username + translatedMessage.slice(1,translatedMessage.length-1)
            let newTranslation = {
              language: newLanguage,
              message: translatedMessage
            }
            let newTranslationMessage = {
              username: chatLog[m].username,
              messageLanguagePairings:[{
                language: newLanguage,
                message: translatedMessage
              }]
            }
            chatLog[m].messageLanguagePairings.push(newTranslation)
            console.log("testing here: ", formattedMessage)
            socket.emit('translated-message', formattedMessage) 
            }).catch(err=>{
              console.log(err)
              return
            }); 
            
        }
      }  
    }
  }

  socket.on('update-translation', (newLanguage) => {
    translateAllMessages(newLanguage).then(result => {
    }).catch(err => {
      console.log(err);
    })
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

