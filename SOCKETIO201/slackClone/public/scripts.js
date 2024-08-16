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
    console.log('The list of namespaces has arrived', nsData);
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.name}><img src="${ns.img}" /></div>`;
    });

})