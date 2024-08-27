function socketMain(io, socket){
    // console.log("A socket connected", socket.id);

    socket.on('clientAuth', (key) => {
        if(key === '5t78yu9girekjaht32i3'){
            // valid nodeClient
            socket.join('clients');
        } else if(key === 'uihfiu3h4f9h3f9h3f9h3'){
            // valid UI client has joined
            socket.join('ui');
            console.log("A react client has joined");
            // socket.on('initPerfData', async (data) => {
            //     const newEntry = new PerfData(data);
            //     await newEntry.save();
            // });
        } else {
            // an invalid client has joined. Goodbye
            socket.disconnect(true);
        }
    });

    socket.on('perfData', (data) => {
        console.log(data);
        // io.emit('data', data);
    });
}

module.exports = socketMain;