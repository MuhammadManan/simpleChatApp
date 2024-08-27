const os = require('os');
const io = require('socket.io-client');
const socket = io('http://localhost:8181');

socket.on('connect', () => {
    console.log("I connected to the socket server... hooray!"); 
});


function performanceData() {
    return new Promise(async (resolve, reject) => {
        try{
            const cpus = os.cpus();
            const freeMem = os.freemem();
            const totlaMem = os.totalmem();
            const usedMem = totlaMem - freeMem;
            const memUsage = Math.floor(usedMem / totlaMem * 100)/100;
            const osType = os.type();
            const upTime = os.uptime();
            const cpuModel = cpus[0].model;
            const numCores = cpus.length;
            const cpuSpeed = cpus[0].speed;
            const cpuLoad = await getCpuLoad();
            resolve({
                freeMem,
                totlaMem,
                usedMem,
                memUsage,
                osType,
                upTime,
                cpuModel,
                numCores,
                cpuSpeed,
                cpuLoad
            });
        } catch(e){
            reject("Rejected promise from Performance Data " + e);
        }
    });
}

 


function cpuAverage() {
    const cpus = os.cpus();
    let idleMs = 0;
    let totalMs = 0;
    cpus.forEach((aCore) => {
        for (type in aCore.times) {
            totalMs += aCore.times[type];
        }
        idleMs += aCore.times.idle;
    });
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length
    }
}

function getCpuLoad(){
    const start = cpuAverage();
    return new Promise((resolve, reject) => {
        try{
            setTimeout(() => {
                const end = cpuAverage();
                const idleDifference = end.idle - start.idle;
                const totalDifference = end.total - start.total;
                const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference);
                resolve(percentageCpu);
            }, 100);
        } catch(e){
            reject("Rejected promise from getCpuLoad" + e);
        }
    });
}

performanceData().then((allData) => {
    console.log(allData);
}).catch((e) => {
    console.log(e);
});