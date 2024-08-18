// Function to join a specific namespace
function joinNS(endpoint) {
    // If already connected to a namespace, close the connection and remove the form submission event listener
    if (nsSocket) {
        nsSocket.close(); // Close the current namespace socket connection
        document.querySelector('#user-input').removeEventListener('submit', formSubmission); // Remove the existing submit event listener to avoid duplicate listeners
    }

    // Establish a new socket connection to the selected namespace
    nsSocket = io(`http://localhost:9000${endpoint}`);

    // Listen for the 'nsRoomLoad' event, which loads the list of rooms in the namespace
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        console.log(nsRooms); // Log the rooms to the console for debugging

        // Select the room list element in the UI and clear its content
        const roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";

        // Iterate over the rooms received from the server and create list items for each room
        nsRooms.forEach((room) => {
            let glyph; // Determine the appropriate icon (lock or globe) based on room privacy
            if (room.privateRoom) {
                glyph = 'lock';
            } else {
                glyph = 'globe';
            }

            // Append each room to the room list with an icon and title
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
        });

        // Add click event listeners to each room in the list to join the selected room
        const roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem) => {
            elem.addEventListener('click', (e) => {
                joinRoom(e.target.innerText); // Join the room when it's clicked
            });
        });

        // Automatically join the top room (first room in the list) when the namespace is loaded
        const topRoom = document.querySelector('.room');
        const roomName = topRoom.innerText;
        joinRoom(roomName); // Join the default top room
    });

    // Listen for new messages from the server
    nsSocket.on('messageToClients', (msg) => {
        const newMsg = buildHTML(msg); // Build the HTML for the new message
        const messageUl = document.querySelector('#messages'); // Select the message list element
        messageUl.innerHTML += newMsg; // Append the new message to the list

        // Scroll to the bottom of the message list to show the most recent message
        messageUl.scrollTo(0, messageUl.scrollHeight);
    });

    // Add a submit event listener to the form for sending new messages
    document.querySelector('.message-form').addEventListener('submit', formSubmission);
}

// Function to handle form submission for sending a new message
function formSubmission(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const newMessage = document.querySelector('#user-message').value; // Get the message input value
    if (newMessage !== "") { // Check if the message is not empty
        nsSocket.emit('newMessageToServer', { text: newMessage }); // Send the message to the server
        document.querySelector('#user-message').value = ""; // Clear the input field after sending
    }
}

// Function to build the HTML for a new message
function buildHTML(msg) {
    // Format the message timestamp into a human-readable format
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    let convertedDate = new Date(msg.time).toLocaleTimeString('en-US', options);
    convertedDate = convertedDate.toLowerCase(); // Convert the timestamp to lowercase for "am/pm"

    // Construct the HTML for the message, including the avatar, username, timestamp, and text
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
     return HTML; // Return the constructed HTML
}
