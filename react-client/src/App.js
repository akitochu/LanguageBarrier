import React, { useState, useRef, useEffect } from 'react';
import MessageLog from "./MessageLog"; 
import { v4 as uuidv4 } from 'uuid';
const { io } = require("socket.io-client");

let socket = null;

function App() {
  const [messages, setMessages] = useState([])
  const messageRef = useRef()
  useEffect(() => {
    if (!socket){
      socket = io.connect('http://localhost:3000');
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

  return (
    <>
      <MessageLog messages={messages}   />
      <input ref={messageRef} type="text" />
      <button onClick={sendMessage}>Send</button>
    </>
    

  )
}

export default App;
