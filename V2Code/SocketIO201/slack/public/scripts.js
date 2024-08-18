// Description: This file contains the client-side JavaScript code for the Slack application.

// Prompt the user for their username
const username = prompt("What is your username?");

// Generate a random avatar URL for the user
const avator = `https://avatar.iran.liara.run/public/${getRandomNumber()}`;

// Establish a connection to the main namespace ('/') on the server
const socket = io('http://localhost:9000', {
    query: {
        username: username, // Send the username to the server via the connection query string
        avator: avator // Send the avatar URL to the server via the connection query string
    }
}); // the / namespace/endpoint

// Variable to hold the socket connection to the currently active namespace
let nsSocket = "";

// Listen for the 'nsList' event from the server, which provides the list of available namespaces
socket.on('nsList', (nsData) => {
    console.log("The list of namespaces has arrived!");
    console.log(nsData);

    // Get the div element where the namespaces will be displayed
    const namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = ""; // Clear any existing content

    // Iterate through the list of namespaces and add them to the page
    nsData.forEach((ns) => {
        // Create a clickable div for each namespace with an associated image
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
    });

    // Add a click event listener to each namespace div
    Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
        elem.addEventListener('click', (e) => {
            const nsEndpoint = elem.getAttribute('ns'); // Get the namespace endpoint from the clicked element
            joinNS(nsEndpoint); // Join the clicked namespace
        });
    });

    // Automatically join the default namespace (e.g., '/wiki') when the page first loads
    joinNS('/wiki');
});

// Helper function to generate a random number between 1 and 50 (used for avatar selection)
function getRandomNumber() {
    return Math.floor(Math.random() * 50) + 1;
}
