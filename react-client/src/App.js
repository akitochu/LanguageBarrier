import React, { useState, useRef, useEffect } from 'react';
import MessageLog from "./MessageLog"; 
import { v4 as uuidv4 } from 'uuid';
const { io } = require("socket.io-client");

let socket = null;

function App() {
  const [liveUsers, updateUserCount] = useState(0);
  const [messages, setMessages] = useState([])
  const messageRef = useRef()
  const usernameRef = useRef()
  useEffect(() => {
    if (!socket){
      socket = io.connect('http://localhost:3000');
      socket.on('new-user', (userCount) => {
        updateUserCount(userCount);
        console.log(liveUsers);
      });      
      socket.on('message-from-others', function(message){
        console.log('Received ' + message);
        addMessage(message)
      })
    }
  }, []);

  function sendMessage(e) {
    const message = messageRef.current.value
    if (message === "") return
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
    updateUserCount(liveUsers + 1);
    const username = usernameRef.current.value
    if (username === "") return
    socket.emit('send-username', username);
    usernameRef.current.value = null
  }

  return (
    <>
      <MessageLog messages={messages}   />
      {liveUsers}
      <input ref={messageRef} type="text" />
      <button onClick={sendMessage}>Send</button>
      <input ref={usernameRef} type="text" />
      <button onClick={sendUsername}>Confirm Username</button>
    </>
    

  )
}

export default App;
