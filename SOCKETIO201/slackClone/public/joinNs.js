
const joinNs= (elem, nsData) =>{
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

    localStorage.setItem('lastNs',nsEndpoint);
}