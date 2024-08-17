const socket = io('http://localhost:9000'); // the / namespace/endpoint

// console.log(socket);
console.log(socket.io);
socket.on('connect',()=>{
    console.log(socket.id)
})

socket.on('nsList',(nsData)=>{
    console.log("The list of namespaces has arrived!");
    const namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((ns)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
    });

    Array.from(document.getElementsByClassName('namespace')).forEach((elem)=>{
        elem.addEventListener('click',(e)=>{
            const nsEndpoint = elem.getAttribute('ns');
            console.log(`${nsEndpoint} I should join now!`);
        });
    });
});

socket.on('messageFromServer',(dataFromServer)=>{
    console.log(dataFromServer);
    socket.emit('dataToServer',{data: "Data from the Client!"})
})

document.querySelector('#message-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('newMessageToServer',{text: newMessage})
})

socket.on('messageToClients',(msg)=>{
    console.log(msg)
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
})

