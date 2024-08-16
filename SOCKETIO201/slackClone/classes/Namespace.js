class Namespace{
    constructor(id, name, img, endpoint){
        this.id = id;
        this.name = name;
        this.img = img;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(roomObj){
        this.rooms.push(roomObj);
    }
}

module.exports = Namespace;