const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/perfData');

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

    socket.on('initprefData', async (data) => {
        console.log(data);
        macA = data.macA;
        try {
            const mongooseResponse = await checkAndAdd(data);
            console.log(mongooseResponse);
        } catch (err) {
            console.error("Error in checkAndAdd:", err);
        }
    });

    socket.on('perfData', (data) => {
        console.log(data);
        // io.emit('data', data);
    });
}

async function checkAndAdd(data) {
    try {
        const doc = await Machine.findOne({ macA: data.macA });
        if (doc === null) {
            // The record is not in the db, so add it
            let newMachine = new Machine(data);
            await newMachine.save();
            return 'added';
        } else {
            // The record is in the db, so don't add it
            return 'found';
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}



module.exports = socketMain;