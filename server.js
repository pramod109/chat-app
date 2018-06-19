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

const user_rooms = new UserRooms();

app.use(express.static(clientPath));

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
});

app.get('/client', function(req, res){
	res.sendFile(path.join(clientPath, 'client-pages', 'client-chat', 'client-chat.html'));
})

app.get('/admin', function(req, res){
	// res.send(user_rooms.getUserRooms());
	// console.log("Printing rooms...");
	// console.log(user_rooms.getUserRooms());
	
	res.sendFile(path.join(clientPath, 'admin-pages', 'admin-chat', 'admin-chat.html'));
});

server.listen(3000,()=>{console.log('Server active...')});