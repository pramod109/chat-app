/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This file handles the socket.io events
*/

import socketIOClient from 'socket.io-client';

// 'http://localhost:3001' for local dev
// '/' for production
const socket = socketIOClient('/');

const socketOn = {
    chatMessage: (callback) => {
        socket.on('chat message', (dataObject) => {
            callback(dataObject);
        });
    },
    updateUserRoomsAdmin: (callback) => {
        socket.on('update user rooms admin', (dataObject) => {
            callback(dataObject);
        })
    },
    updateUserRooms: (callback) => {
        socket.on('update user rooms', (dataObject) => {
            callback(dataObject);
        })
    },
    updateUserMessages: (callback) => {
        socket.on('update user messages', (dataObject) => {
            callback(dataObject);
        })
    }

};

const socketEmit = {

    createRoom: (roomName, callback) => {
        socket.emit('create room', roomName, (err) => callback(err));
    },
    
    chatMessage: (dataObject, callback) => {
        socket.emit('chat message', dataObject, (err) => callback(err));
    },

    getUsers: (callback) => {
        socket.emit('get users', (err) => callback(err));
    },

    getMessages: (roomName,callback) => {
        socket.emit('get messages', roomName, (err) => callback(err));
    }

};

export {socketOn, socketEmit };