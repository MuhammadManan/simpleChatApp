const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

const expressServer = app.listen(8001, () => {
  console.log('Server running on port 8001');
});

const io = socketio(expressServer);

io.of('/').on('connection', (socket) => {
// io.on('connection', (socket) => {
  socket.join('chatRoom');
  io.of('/').to('chatRoom').emit('WelcomeToChatRoom',{});
  io.of('/').to('chatRoom').to('chatRoom2').to('admin').emit('WelcomeToChatRoom',{});
  io.of('/admin').emit('welcome','');
    console.log(socket.id, ' has connected');
     socket.on('newMessageToServer', (dataFromClient) => {
        console.log('Data from client: ', dataFromClient);
        io.of('/').emit('newMessageToClients', {text: dataFromClient.text});
        // io.emit('newMessageToClients', {text: dataFromClient.text});
    });
});

io.of('/admin').on('connection', (socket) => {
    console.log('Someone connected to the admin namespace');
    io.of('/admin').emit('welcomeToChatRoom', 'Welcome to the admin channel');
});