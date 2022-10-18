import React from 'react'
import Message from './Message'
export default function MessageLog({ messages }) {
  return (
    messages.map(message => {
        return <Message key={message.id} message={message} />
    })
  )
}
