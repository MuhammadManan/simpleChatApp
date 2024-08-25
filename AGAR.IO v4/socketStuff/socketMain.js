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
let tickTockInterval;

initGame();
// console.log(orbs);

io.on('connect', (socket) => {
    // console.log('socket connected');
    let player = {};

    socket.on('init', (playerObj, ackCallback) => {

        if(players.length === 0){
            tickTockInterval = setInterval(() => {
                io.to('game').emit('tick', {
                    players
                });
            }, 33);
        }

        socket.join('game');
        // console.log(data);
        const playerName = playerObj.playerName;
        const playerConfig = new PlayerConfig(settings);
        const playerData = new PlayerData(playerName, settings);
        player = new Player(socket.id, playerConfig, playerData);
        players.push(player);
    
        ackCallback(orbs);
    });

    socket.on('tock', (data) => {
        speed = player.playerConfig.speed;
        const xV = player.playerConfig.xVector = data.xVector;
        const yV = player.playerConfig.yVector = data.yVector;

        if((player.playerData.locX < 5 && xV < 0) || (player.playerData.locX > 500) && (xV > 0)){
            player.playerData.locY -= speed * yV;
        }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > 500) && (yV < 0)){
            player.playerData.locX += speed * xV;
        }else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }
    });

    socket.on('disconnect', () => {
        if(players.length === 0){
            clearInterval(tickTockInterval);
        }
    });
});

function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
} 


module.exports = io;