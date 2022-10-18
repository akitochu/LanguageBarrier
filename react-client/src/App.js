import React, { useState, useRef } from 'react';
import MessageLog from "./MessageLog"; 
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [messages, setMessages] = useState([])
  const messageRef = useRef()
  function sendMessage(e) {
    const message = messageRef.current.value
    if (message === "") return
    setMessages(prevTodos => {
      return [...prevTodos, {id: uuidv4(), original: message}]
    })
    messageRef.current.value = null
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
