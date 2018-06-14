/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This page handles the backend requests for the chat application
*/

var express = require('express');
var socket = require('socket.io');
var app = express();



server = app.listen(process.env.PORT || 3003, () =>{
	console.log("Server active on port 3003");
});

io = socket(server);

io.on('connection', (socket)=>{
	console.log("New socket created");
});