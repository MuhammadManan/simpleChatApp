const express = require('express');
const app = express();
const socketio = require('socket.io');
let namespaces = require('./data/namespaces');



app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000, ()=>{
    console.log("Server is listening on port 9000")
});
const io = socketio(expressServer);


// io.on = io.of('/').on
io.on('connection',(socket)=>{
     let nsData = namespaces.map((ns)=>{
        return{
            img: ns.img,
            endpoint: ns.endpoint
        }
     });
    // console.log(nsData);

    socket.emit('nsList',nsData);
})

namespaces.forEach((namespace)=>{
    io.of(namespace.endpoint).on('connection', (nsSocket)=>{
        const username = nsSocket.handshake.query.username;
        const avator = nsSocket.handshake.query.avator;
        console.log(`${username} has joined ${namespace.endpoint}`);


        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin,numberOfUsersCallback)=>{
            // console.log(roomToJoin);
            const roomToLeave = Array.from(nsSocket.rooms)[1];
            // console.log('Room to Leave: ',roomToLeave);
            if (roomToLeave) {
                // Leave the room
                nsSocket.leave(roomToLeave);
                updateUsersInRoom(namespace,roomToLeave);
                console.log(`Room: ${roomToLeave} has been left`);
            }
            
            if(roomToJoin){
                nsSocket.join(roomToJoin);
                // send history to the client who just joined
                const nsRoom = namespace.rooms.find((room)=>{
                    return room.roomTitle === roomToJoin;
                });
                // console.log("nsRoom",nsRoom);
                nsSocket.emit('historyCatchUp',nsRoom.history);
                // send number of users in the room to all clients
                updateUsersInRoom(namespace,roomToJoin);
                console.log(`Room: ${roomToJoin} has been joined`);
            }

        });

        nsSocket.on('newMessageToServer',(msg)=>{
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avator: avator
            };
            console.log(fullMsg);
            console.log("New message nsSocket Rooms: ",nsSocket.rooms);
            const roomTitle = Array.from(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle === roomTitle;
            });
            nsRoom.addMessage(fullMsg);
            // console.log('Nechy wala nsRoom: ',nsRoom);
            // nsRoom.clearHistory();
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg);
        });
    });
});

function  updateUsersInRoom(namespace,roomToJoin){
    io.of(namespace.endpoint).in(roomToJoin).fetchSockets().then((clients)=>{
        console.log(`There are ${clients.length} in this room`);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers',clients.length);
    });
}