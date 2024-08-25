const socket = io.connect('http://localhost:9000');

const init = async() => {
    try{
        const initOrbs = await socket.emitWithAck('init', {
             playerName: player.name
         });
         console.log(initOrbs);
         orbs = initOrbs;
         draw();
    }
    catch(e){
        console.log("Error on init: ", e);
    }
}

socket.on('initReturn', (initData) => {
    console.log(initData);
    orbs = initData.orbs;
});