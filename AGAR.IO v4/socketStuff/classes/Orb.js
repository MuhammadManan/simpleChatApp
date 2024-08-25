class Orb{
    constructor(settings){
        this.color = this.getRandomColor();
        this.locX = Math.floor(Math.random() * settings.worldWidth);
        this.locY = Math.floor(Math.random() * settings.worldHeight);
        this.radius = settings.defaultGenericOrbSize;
    }

    getRandomColor(){
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        return `rgb(${r},${g},${b})`;
    }
}

module.exports = Orb;