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
    socket.on('newMessage', (data) => {     
        io.emit('messageFromServer', data);
    });
}); 