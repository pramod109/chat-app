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
app.use('/admin-chat', express.static(path.join(clientPath, 'admin-pages', 'admin-chat')));

app.get('/', function(req,res){
	res.sendFile(path.join(clientPath, 'index.html'));
});

io.on('connection', function(socket){
	console.log("A user connected...")
	
	socket.on('disconnect', function(){
		console.log("User disconnected...")
	});
	
	socket.on('chat message', function(data){
		
		const room = user_rooms.getUserRoom(data.roomName);
		room.messages.push(data.message);
		io.emit('chat message', data);
		console.log(user_rooms.getUserRooms());

	});

	socket.on('get users', function(){
		io.emit('update user rooms admin',user_rooms.getUserRooms());
	})

	socket.on('create room', function(roomName){
		user_rooms.addUserRoom(roomName);
		user_rooms.addUser(roomName, roomName);
		io.emit('update user rooms', user_rooms.getUserRooms());
		console.log(user_rooms.getUserRooms());
	})

	socket.on('get messages', function(roomName){
		const room = user_rooms.getUserRoom(roomName);
		io.emit('update user messages', room.messages);
		console.log(room.messages);
	});
});

app.get('/client-register', function(req, res){
	res.sendFile(path.join(clientPath, 'client-pages', 'add-room', 'add-room.html'));
});


app.get('/admin-chat', function(req, res){
	res.sendFile(path.join(clientPath, 'admin-pages', 'admin-chat', 'admin-chat.html'));
});

server.listen(3001,()=>{console.log('Server active on 3001...')});