import React from 'react'

export default function Message({ message }) {
  return (
    <div>
        <label>
            {message.original}
        </label>
    </div>
  )
}

