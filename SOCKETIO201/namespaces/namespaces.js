const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

const io = socketio(expressServer);

io.on('connection', (socket) => {
    console.log(socket.id, ' has connected');

     socket.on('newMessageToServer', (dataFromClient) => {
        console.log('Data from client: ', dataFromClient);
        io.emit('newMessageToClients', {text: dataFromClient.text});
    });
});