const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/perfData', { useNewUrlParser: true });

const Machine = require('./models/Machine');

function socketMain(io, socket){
    // console.log("A socket connected", socket.id);

    let macA;

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

    socket.on('initprefData', (data) => {
        console.log(data);
        // const newMachine = new Machine(data);
        // await newMachine.save();
        // console.log(await Machine.find({}));
    }) ;

    socket.on('perfData', (data) => {
        console.log(data);
        // io.emit('data', data);
    });
}

module.exports = socketMain;