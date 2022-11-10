import React, { useState, useRef, useEffect } from 'react';
import MessageLog from "./MessageLog"; 
import "./layout.css";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
const { io } = require("socket.io-client");

let socket = null;

function App() {
  const [users, updateUsers] = useState([]);
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState([])
  const messageRef = useRef()
  const usernameRef = useRef()
  let usernameSet = false;
  let thisUsername = '';
  useEffect(() => {
    if (!socket){
      socket = io.connect('http://localhost:3000');
      socket.on('new-user', (userCount, users) => {
        updateUsers(users)
        socket.emit('codeboard-message', "uptodate");      
      });      
      socket.on('update-users', (users) => {
        updateUsers(users);
      });
      socket.on('message-from-others', function(message){
        console.log('Received ' + message);
        if (typeof message === "string"){
          addMessage(message)
        }else { 
          for (let i = 0; i<message.length; i++){
            addMessage(message[i])
          }
        }
        
      })
      socket.on('check-for-updating-username', (newUsername) =>{
        if(usernameSet === true){
          socket.emit('update-username', newUsername, thisUsername)
          thisUsername = newUsername
          setUsername(newUsername)
        }else{
          usernameSet = true;
          thisUsername = newUsername
          socket.emit('new-username', newUsername)
        }
      })
    }
  }, []);

  function sendMessage(e) {
    const message = username + ": " + messageRef.current.value
    console.log(message)
    if (messageRef.current.value === "") return
    console.log(username)
    if (username.length === 0){
      messageRef.current.value = null
      window.alert("Enter Username First")
      return
    } 
    addMessage(message)
    socket.emit('codeboard-message', message);
    messageRef.current.value = null
  }

  function addMessage(message) {
    setMessages(prevMessages => {
      return [...prevMessages, {id: uuidv4(), original: message}]
    })
  }

  function sendUsername(e) {
    const username = usernameRef.current.value
    updateUsers(prevUsers => {
      return [...prevUsers, username]
    });
    setUsername(prevUsername => {
      return [...prevUsername, username]
    })
    if (username === "") return
    socket.emit('send-username', username);
    usernameRef.current.value = null
  }

  return (
    <>
      <div>Username:</div>
      {username}
      <div>Online Users:</div>
      {users}
      <div>
        <input ref={usernameRef} type="text" />
        <button onClick={sendUsername}>Confirm Username</button>
      </div>
      <select data-placeholder="Choose a Language...">
        <option value="AF">Afrikaans</option>
        <option value="SQ">Albanian</option>
        <option value="AR">Arabic</option>
        <option value="HY">Armenian</option>
        <option value="EU">Basque</option>
        <option value="BN">Bengali</option>
        <option value="BG">Bulgarian</option>
        <option value="CA">Catalan</option>
        <option value="KM">Cambodian</option>
        <option value="ZH">Chinese (Mandarin)</option>
        <option value="HR">Croatian</option>
        <option value="CS">Czech</option>
        <option value="DA">Danish</option>
        <option value="NL">Dutch</option>
        <option value="EN">English</option>
        <option value="ET">Estonian</option>
        <option value="FJ">Fiji</option>
        <option value="FI">Finnish</option>
        <option value="FR">French</option>
        <option value="KA">Georgian</option>
        <option value="DE">German</option>
        <option value="EL">Greek</option>
        <option value="GU">Gujarati</option>
        <option value="HE">Hebrew</option>
        <option value="HI">Hindi</option>
        <option value="HU">Hungarian</option>
        <option value="IS">Icelandic</option>
        <option value="ID">Indonesian</option>
        <option value="GA">Irish</option>
        <option value="IT">Italian</option>
        <option value="JA">Japanese</option>
        <option value="JW">Javanese</option>
        <option value="KO">Korean</option>
        <option value="LA">Latin</option>
        <option value="LV">Latvian</option>
        <option value="LT">Lithuanian</option>
        <option value="MK">Macedonian</option>
        <option value="MS">Malay</option>
        <option value="ML">Malayalam</option>
        <option value="MT">Maltese</option>
        <option value="MI">Maori</option>
        <option value="MR">Marathi</option>
        <option value="MN">Mongolian</option>
        <option value="NE">Nepali</option>
        <option value="NO">Norwegian</option>
        <option value="FA">Persian</option>
        <option value="PL">Polish</option>
        <option value="PT">Portuguese</option>
        <option value="PA">Punjabi</option>
        <option value="QU">Quechua</option>
        <option value="RO">Romanian</option>
        <option value="RU">Russian</option>
        <option value="SM">Samoan</option>
        <option value="SR">Serbian</option>
        <option value="SK">Slovak</option>
        <option value="SL">Slovenian</option>
        <option value="ES">Spanish</option>
        <option value="SW">Swahili</option>
        <option value="SV">Swedish </option>
        <option value="TA">Tamil</option>
        <option value="TT">Tatar</option>
        <option value="TE">Telugu</option>
        <option value="TH">Thai</option>
        <option value="BO">Tibetan</option>
        <option value="TO">Tonga</option>
        <option value="TR">Turkish</option>
        <option value="UK">Ukrainian</option>
        <option value="UR">Urdu</option>
        <option value="UZ">Uzbek</option>
        <option value="VI">Vietnamese</option>
        <option value="CY">Welsh</option>
        <option value="XH">Xhosa</option>
      </select>

      <div id="chatBox">Chat:
        <MessageLog messages={messages}/>
      </div>

      <div id="sendMessage">
        <input id="textBox" ref={messageRef} type="text" />
        <button id="sendButton" onClick={sendMessage}>Send</button>
      </div>
    </>
    
    

  )
}

export default App;
