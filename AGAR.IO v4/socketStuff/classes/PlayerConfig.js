// this is the class that will be used to store the player's configuration data and not the data that will be shared with other players

class PlayerConfig{
    constructor(settings){
        this.xVector = 0;
        this.yVector = 0;
        this.speed = settings.defaultSpeed;
        this.zoom = settings.defaultZoom;
    }
}

module.exports = PlayerConfig;