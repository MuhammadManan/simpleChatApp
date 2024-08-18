const express = require('express');
const app = express();
const socketio = require('socket.io');
let namespaces = require('./data/namespaces');

// console.log(namespaces[0]);

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
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

        nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
        nsSocket.on('joinRoom', async (roomToJoin,numberOfUsersCallback)=>{
            // console.log(roomToJoin);
            nsSocket.join(roomToJoin);
            // const clients = await io.of('/wiki').in(roomToJoin).fetchSockets();
            // console.log(clients.length);
            // numberOfUsersCallback(clients.length);


            // send history to the client who just joined
            const nsRoom = namespaces[0].rooms.find((room)=>{
                return room.roomTitle === roomToJoin;
            });
            console.log("nsRoom",nsRoom);
            nsSocket.emit('historyCatchUp',nsRoom.history);

            // send number of users in the room to all clients
            io.of('/wiki').in(roomToJoin).fetchSockets().then((clients)=>{
                console.log(`There are ${clients.length} in this room`);
                io.of('/wiki').in(roomToJoin).emit('updateMembers',clients.length);
            })


        });

        nsSocket.on('newMessageToServer',(msg)=>{
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: "rbhatia",
                avator: 'https://via.placeholder.com/30'
            };
            // console.log(fullMsg);
            // console.log(nsSocket.rooms);
            const roomTitle = Array.from(nsSocket.rooms)[1];
            const nsRoom = namespaces[0].rooms.find((room)=>{
                return room.roomTitle === roomTitle;
            });
            nsRoom.addMessage(fullMsg);
            console.log('Nechy wala nsRoom: ',nsRoom);
            // nsRoom.clearHistory();
            io.of('/wiki').to(roomTitle).emit('messageToClients',fullMsg);
        });
    });
});