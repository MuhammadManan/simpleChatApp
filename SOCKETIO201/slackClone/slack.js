const express = require('express');
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');

const app = express();

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000, () => {
  console.log(`Server running on port ${9000}`);
});

const io = socketio(expressServer);

io.on('connection', (socket) => {
    socket.emit('welcome', 'Welcome to the socket.io server');
    socket.on('clientConnect',()=>{
        console.log(socket.id, ' has connected');
    })

    // send the namespaces object to the client
    socket.emit('nsList', namespaces);
});