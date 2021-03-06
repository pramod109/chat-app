/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the UserRooms class to hold data for each user chatroom
*/

class UserRooms{
    constructor(){
        this.userRooms = [
            {
                name: 'Test room 1',
                id:'',
                users: [],
                messages: []
            }
        ];
    }

    getUserRooms(){
        return this.userRooms;
    }

    getUserRoom(roomName){
        return this.userRooms.find(room => room.name === roomName);
    }

    getRoomById(id){
        return this.userRooms.find(room => room.id === id);
    }

    addUserRoom(roomName, id){
        if(!this.userRooms.find(room => room.name === roomName)){
            this.userRooms.push({
                name: roomName,
                id: id,
                users: [],
                messages: []
            })
        }
    }

    removeUserRoom(roomName){
        this.userRooms = this.userRooms.filter((room) => {
            if(roomName !== 'Test room'){
                return room.name !== roomName;
            }

            return room;
        })
    }

    addUser(userName, roomName){
        var room = this.userRooms.find(room => room.name === roomName);
        room.users.push(userName);
        // if(!room.users.find(user => user === userName)){
        //     room.users.push(userName);
        // }
    }

    removeUser(userName, roomName){
        const room = this.getUserRoom(roomName);

        if(room){
            room.users = room.users.filter(user => user !== userName);

            if(!room.users.length){
                this.removeUserRoom(roomName);
            }
        }
    }

    addMessage(message,roomName){
        const room = this.getUserRoom(roomName);

        if(room){
            room.messages.push(message);
        }
    }
}
module.exports = { UserRooms };
