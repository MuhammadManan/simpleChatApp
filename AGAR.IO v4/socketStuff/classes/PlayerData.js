// this class will hold all the data for each individual player that everyone will see
class PlayerData{
    constructor(playerName, settings){
        this.playerName = playerName;
        this.locX = Math.floor(Math.random() * settings.worldWidth);
        this.locY = Math.floor(Math.random() * settings.worldHeight);
        this.radius = settings.defaultSize;
        this.color = this.getRandomColor();
        this.score = 0;
        this.orbsAbsorbed = 0;
    }
    getRandomColor(){
        const r = Math.floor(Math.random() * 200 + 50);
        const g = Math.floor(Math.random() * 200 + 50);
        const b = Math.floor(Math.random() * 200 + 50);
        return `rgb(${r},${g},${b})`;
    }
}

module.exports = PlayerData;