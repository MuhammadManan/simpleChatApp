function joinNS(endpoint){
    if(nsSocket){
        nsSocket.close();
        document.querySelector('#user-input').removeEventListener('submit',formSubmission);
    }
    nsSocket = io(`http://localhost:9000${endpoint}`);
    nsSocket.on('nsRoomLoad',(nsRooms)=>{
        console.log(nsRooms);

        const roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";
        nsRooms.forEach((room)=>{
            let glyph;
            if(room.privateRoom){
                glyph = 'lock';
            }  else{
                glyph = 'globe';
            }
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
        });

        const roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem)=>{
            elem.addEventListener('click',(e)=>{
                // console.log("Someone clicked on ", e.target.innerText);
                joinRoom(e.target.innerText);
            });
        });

        const topRoom = document.querySelector('.room');
        const roomName = topRoom.innerText;
        // console.log(roomName);
        joinRoom(roomName);
    });

    nsSocket.on('messageToClients',(msg)=>{
        // console.log(msg);
        const newMsg = buildHTML(msg);
        const messageUl = document.querySelector('#messages');
        messageUl.innerHTML += newMsg;

        messageUl.scrollTo(0,messageUl.scrollHeight);
    });


    document.querySelector('.message-form').addEventListener('submit',formSubmission);
    
}

function formSubmission(event){
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    if(newMessage !== ""){
        nsSocket.emit('newMessageToServer',{text: newMessage})
        document.querySelector('#user-message').value = "";
    }
}

function buildHTML(msg){
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    let convertedDate = new Date(msg.time).toLocaleTimeString('en-US',options);
    convertedDate = convertedDate.toLowerCase();
    const HTML = 
    `
    <li>
         <div class="user-image">
             <img id="avator" src="${msg.avator}" />
         </div>
         <div class="user-message">
             <div class="user-name-time">${msg.username}<span> ${convertedDate}</span></div>
             <div class="message-text">${msg.text}</div>
         </div>
     </li>
     
     `;
     return HTML; ; 
 }