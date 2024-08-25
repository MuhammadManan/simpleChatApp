const socket = io.connect('http://localhost:9000');

const init = async() => {
    try{
        const initOrbs = await socket.emitWithAck('init', {
             playerName: player.name
         });

         setInterval(() => {
            socket.emit('tock',{
                xVector: player.xVector,
                yVector: player.yVector
            });
        }, 33);
         console.log(initOrbs);
         orbs = initOrbs;
         draw();
    }
    catch(e){
        console.log("Error on init: ", e);
    }
}

socket.on('tick', (playersArray) => {
    console.log(playersArray); 
    players = playersArray;
});