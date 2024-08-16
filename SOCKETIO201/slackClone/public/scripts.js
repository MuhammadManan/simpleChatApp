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
            joinNs(elem,nsData);
        });
    });    

    // open from the last namespace
    const lastNs = localStorage.getItem('lastNs');
    // if lastNs is not null, join the lastNs, instead of 0th ns
    if(!lastNs){
        //...
    }
    joinNs(document.getElementsByClassName('namespace')[0],nsData);
});