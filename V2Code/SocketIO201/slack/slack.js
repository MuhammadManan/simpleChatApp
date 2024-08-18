const express = require('express');
const app = express();
const socketio = require('socket.io');
let namespaces = require('./data/namespaces'); // Importing namespaces data

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Start the Express server on port 9000
const expressServer = app.listen(9000, ()=>{
    console.log("Server is listening on port 9000");
});

const io = socketio(expressServer); // Initialize Socket.IO with the Express server

// Handle connection to the main namespace ('/')
io.on('connection', (socket) => {
    // Prepare the list of namespaces to send to the client
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img, // Namespace image
            endpoint: ns.endpoint // Namespace endpoint
        };
    });

    // Send the list of namespaces to the client
    socket.emit('nsList', nsData);
});

// Loop through each namespace and set up connection handlers
namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        // Get the username and avatar from the client's connection handshake query
        const username = nsSocket.handshake.query.username;
        const avator = nsSocket.handshake.query.avator;
        console.log(`${username} has joined ${namespace.endpoint}`);

        // Send the list of rooms in this namespace to the client
        nsSocket.emit('nsRoomLoad', namespace.rooms);

        // Handle the client joining a specific room
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
            const roomToLeave = Array.from(nsSocket.rooms)[1]; // Determine the room to leave (if any)
            
            if (roomToLeave) {
                // Leave the current room
                nsSocket.leave(roomToLeave);
                updateUsersInRoom(namespace, roomToLeave); // Update user count in the room that was left
                console.log(`Room: ${roomToLeave} has been left`);
            }
            
            if (roomToJoin) {
                // Join the new room
                nsSocket.join(roomToJoin);

                // Find the room object to retrieve its history
                const nsRoom = namespace.rooms.find((room) => {
                    return room.roomTitle === roomToJoin;
                });

                // Send the chat history of the room to the client
                nsSocket.emit('historyCatchUp', nsRoom.history);

                // Update the user count in the room that was joined
                updateUsersInRoom(namespace, roomToJoin);
                console.log(`Room: ${roomToJoin} has been joined`);
            }
        });

        // Handle a new message from the client
        nsSocket.on('newMessageToServer', (msg) => {
            const fullMsg = {
                text: msg.text, // Message text
                time: Date.now(), // Timestamp
                username: username, // Username from handshake
                avator: avator // Avatar from handshake
            };
            console.log(fullMsg);

            // Determine the room the client is currently in
            const roomTitle = Array.from(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;
            });

            // Add the new message to the room's history
            nsRoom.addMessage(fullMsg);

            // Broadcast the new message to all clients in the room
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
        });
    });
});

// Function to update the number of users in a room and notify all clients in that room
function updateUsersInRoom(namespace, roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).fetchSockets().then((clients) => {
        console.log(`There are ${clients.length} in this room`);
        // Emit an update to all clients in the room with the new user count
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    });
}
