class Room{
    constructor(roomId, roomName, namepsaceId, privateRoom = false){
        this.roomId = roomId;
        this.roomName = roomName;
        this.namespaceId = namepsaceId;
        this.privateRoom = privateRoom;
        this.history = [];
    };

    addMessage(message){
        this.history.push(message);
    };
    clearHistory(){
        this.history = [];
    };
}

module.exports = Room;