// set the hieght and width of the canvas
let wHeight = window.innerHeight;
let wWidth = window.innerWidth;
const canvas = document.querySelector('#the-canvas');
const context  = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;    

let player ={}; 
let orbs = [];

// Modal 
const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));

window.addEventListener('load', () => {
    // on page load, open the login modal
    loginModal.show();
});

document.querySelector('.name-form').addEventListener('submit', (e) => {
    e.preventDefault();
    player.name = document.querySelector('#name-input').value;
    document.querySelector('.player-name').innerText = player.name;
    loginModal.hide();
    spawnModal.show();
    console.log(player);
});


document.querySelector('.start-game').addEventListener('click', (e) => {
    spawnModal.hide();
    const elArray = Array.from(document.querySelectorAll('.hiddenOnStart'));
    elArray.forEach((el) => {
        el.removeAttribute('hidden');
    });
    init();
});