const express = require('express');
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000, ()=>{
    console.log('Server running on port 9000')
});
const io = socketio(expressServer);
io.of('/').on('connection',(socket)=>{
    console.log('Someone connected to the main namespace')
    socket.emit('messageFromServer',{data:"Welcome to the socketio server"});
    socket.on('messageToServer',(dataFromClient)=>{
        console.log(dataFromClient)
    })
    socket.on('newMessageToServer',(msg)=>{
        // console.log(msg)
        // io.emit('messageToClients',{text:msg.text})
        io.of('/').emit('messageToClients',{text:msg.text})
    })
    setTimeout(()=>{
        // socket.send('Welcome to the socketio server!')
        io.of('/admin').emit('welcome','Welcome to the admin channel from the main namespace!')
    },2000);
})

io.of('/admin').on('connection',(socket)=>{
    console.log('Someone connected to the admin namespace')
    io.of('/admin').emit('welcome','Welcome to the admin channel!')
});