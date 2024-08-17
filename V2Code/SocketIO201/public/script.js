const socket = io('http://localhost:9000');
const socket2= io('http://localhost:9000/admin');
 
 socket2.on('welcome',(data)=>{
    console.log(data);
});
 

socket.on('joined',(data)=>{
    console.log(data);
});
 
    
socket.on('messageFromServer',({data})=>{
    console.log(data);
    socket.emit('messageToServer',{data: "Thank You... from the Client!"})
});

document.querySelector('#message-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('newMessageToServer',{text: newMessage});
    document.querySelector('#user-message').value = '';
});