/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This page handles the backend requests for the chat application
Reference: https://socket.io/get-started/chat/
*/

const http = require('http');
const path = require('path');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const clientPath = path.join(__dirname, 'client-files');
const express = require('express');
const { UserRooms } = require('./UserRooms');
const bodyParser = require('body-parser');
const user_rooms = new UserRooms();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(clientPath));
app.use('/client-register', express.static(path.join(clientPath, 'client-pages', 'add-room')));
app.use('/client-chat', express.static(path.join(clientPath, 'client-pages', 'client-chat')));

app.get('/', function(req,res){
	res.sendFile(path.join(clientPath, 'index.html'));
});

io.on('connection', function(socket){
	console.log("A user connected...")
	
	socket.on('disconnect', function(){
		console.log("User disconnected...")
	});
	
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('create room', function(roomName){
		socket.join(roomName);
		socket.room = roomName;
		user_rooms.addUserRoom(roomName);
		user_rooms.addUser(roomName, roomName);
		io.emit('update user rooms', user_rooms.getUserRooms());
		console.log(user_rooms.getUserRooms());
	})
});

app.get('/client-register', function(req, res){
	res.sendFile(path.join(clientPath, 'client-pages', 'add-room', 'add-room.html'));
});


app.get('/admin', function(req, res){
	// res.send(user_rooms.getUserRooms());
	// console.log("Printing rooms...");
	// console.log(user_rooms.getUserRooms());
	res.sendFile(path.join(clientPath, 'admin-pages', 'admin-chat', 'admin-chat.html'));
});

server.listen(3000,()=>{console.log('Server active...')});