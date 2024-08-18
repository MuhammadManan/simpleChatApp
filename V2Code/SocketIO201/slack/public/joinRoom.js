// Function to handle joining a specific room within a namespace
function joinRoom(roomName) {
    // Emit an event to the server to join the specified room
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        // Update the UI with the number of users in the room
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
    });

    // Listen for the 'historyCatchUp' event from the server, which sends the chat history of the room
    nsSocket.on('historyCatchUp', (history) => {
        const messagesUl = document.querySelector('#messages'); // Select the messages list element
        messagesUl.innerHTML = ""; // Clear any existing messages in the list

        // Iterate through the chat history and build the message HTML for each one
        history.forEach((msg) => {
            const newMsg = buildHTML(msg); // Convert the message object to HTML
            const currentMessages = messagesUl.innerHTML; // Get the current messages in the list
            messagesUl.innerHTML = currentMessages + newMsg; // Append the new message to the list
        });

        // Scroll to the bottom of the messages list to show the most recent message
        messagesUl.scrollTo(0, messagesUl.scrollHeight);
    });

    // Listen for the 'updateMembers' event, which updates the number of users in the room
    nsSocket.on('updateMembers', (numMembers) => {
        // Update the room name in the UI
        document.querySelector('.curr-room-text').innerText = `${roomName}`;
        // Update the number of users in the room in the UI
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
    });

    // Add an input event listener to the search box for filtering messages in the room
    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', (e) => {
        let messages = Array.from(document.getElementsByClassName('message-text')); // Get all messages in the room
        console.log(messages); // Log the messages for debugging

        // Iterate through all the messages and filter them based on the search input
        messages.forEach((msg) => {
            // Check if the message contains the search term (case insensitive)
            if (msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) {
                // If the message does not contain the search term, hide it
                msg.style.display = "none";
            } else {
                // If the message contains the search term, show it
                msg.style.display = "block";
            }
        });
    });
}
