Pre-requisite
cd react-client
npm run build


Usage 
npm install express
npm install socket.io
node server.js
open localhost:3000/chat


protocol

    hello   name    // client sends hello to the server with the name
    welcome welcome-json    // server sends back welcome message with JSON contents
                {
                    user_id: number,   //! unique id assigned to the user
                    users: [           //! array of online users    
                        { user_id, name, }, //! id and name 
                    ],
                    messages: [        // array of already exchanged messages
                        { user_id, message }, //! id of the user and the message
                    ],
                }
    user-entered  { user_id, name }  //! when a new user enters the room, server broadcasts this

    text    {user_id, message} // client sends text to the server
    text-from-others    {user_id, message}     // server broadcasts 


