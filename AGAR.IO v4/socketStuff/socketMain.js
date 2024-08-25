const io = require('../servers.js').io;
const app = require('../servers.js').app;

const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const Orb = require('./classes/Orb');

const orbs = [];
const settings = {
    defaultOrbs: 500,
    defaultSpeed: 6,
    defaultSize: 6,
    // as a player gets bigger, the zoom needs to go out
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500,
    defaultGenericOrbSize : 5
};
const players = [];

initGame();
// console.log(orbs);

io.on('connect', (socket) => {
    // console.log('socket connected');
    socket.on('init', (playerObj, ackCallback) => {
        // console.log(data);
        const playerName = playerObj.playerName;
        const playerConfig = new PlayerConfig(settings);
        const playerData = new PlayerData(playerName, settings);
        const player = new Player(socket.id, playerConfig, playerData);
        players.push(player);
    
        ackCallback(orbs);
    });
});

function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
} 


module.exports = io;