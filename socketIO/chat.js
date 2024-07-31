const express = require('express');
const socketIO = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));


const expressServer = app.listen(5000, () => {    
    console.log('Server running on http://localhost:5000/');
});
const io = socketIO(expressServer);

io.on('connection', (socket,req) => {  
    console.log('a user connected');
    socket.emit('welcome', 'Hello from server');
    socket.on('message', (msg) => {
        console.log('message: ' + msg.message);
    }); 

    // Handle custom ping-pong for latency measurement
    socket.on('pingCheck', (startTime) => {
        console.log('pong is received from the client');
        socket.emit('pongCheck', startTime);
    }); 
}); 