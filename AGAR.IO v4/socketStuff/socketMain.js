const io = require('../servers.js').io;
const app = require('../servers.js').app;
const Orb = require('./classes/Orb');

const orbs = [];

initGame();
// console.log(orbs);

io.on('connect', (socket) => {
    // console.log('socket connected');
    socket.emit('init', {
        orbs
    });
});

function initGame(){
    for(let i = 0; i < 500; i++){
        orbs.push(new Orb());
    }
} 


module.exports = io;