const express = require('express');
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000, ()=>{
    console.log('Server running on port 9000')
});
const io = socketio(expressServer);
io.of('/').on('connection',(socket)=>{  
    socket.emit('messageFromServer',{data:"Welcome to the main page!"});
    socket.on('messageToServer',({data})=>{
        console.log(data);
    });
    socket.join('level1'); 
    socket.to('level1').emit('joined',` ${socket.id} says: he has joined level 1!`);
    // io.of('/').to('level1').emit('joined',` ${socket.id} says: he has joined level 1!`);   
});

 

io.of('/admin').on('connection',(socket)=>{ 
    console.log('Someone connected to the admin namespace!');
    io.of('/admin').emit('welcome','Welcome to the admin channel!');
});