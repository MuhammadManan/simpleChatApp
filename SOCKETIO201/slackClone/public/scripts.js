// const userNmae = prompt('Enter your name');
// const password = prompt('Enter your password');

const userName = 'test';
const password = 'test';

const socket = io('http://localhost:9000');

socket.on('connect',()=>{
    console.log('Connected to the server');
    socket.emit('clientConnect');
});

socket.on('welcome',(data)=>{
    console.log(data);
});

// listen the nsList from the server which is an array of namespaces
socket.on('nsList',(nsData)=>{
    // console.log('The list of namespaces has arrived', nsData);
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
    });

    // Add a click listener for each namespace
    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        // console.log(elem);
        elem.addEventListener('click',(e)=>{
            const nsEndpoint = elem.getAttribute('ns');
            // console.log(`${nsEndpoint} I should go to now`);
            const clickedNs = nsData.find(row=> row.endpoint === nsEndpoint);
            // console.log('clickedNs ',clickedNs);
            const rooms = clickedNs.rooms;
            // console.log('roomList',rooms);
            let roomList = document.querySelector('.room-list');
            roomList.innerHTML = "";
            rooms.forEach((room)=>{
                roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomName}</li>`
            });
        });
    });    
});