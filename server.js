/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This page handles the backend requests for the chat application
*/

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const express = require('express');
const { UserRooms } = require('./UserRooms');
const bodyParser = require('body-parser');
const user_rooms = new UserRooms();

const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const user = require('./models/user');
const cors = require('cors');
const bcrypt = require('bcrypt');
const port = process.env.PORT || 3001;
const path = require('path');

mongoose.connect(config.database, () => {
	console.log('Successfully connected to mongodb database...');
});

app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(cors());

//creating an admin user if it does not exists [Immediately invoked function]
(function() {
	var adminUser = new user({
		name: 'admin',
		password: bcrypt.hashSync('password', 8),
		admin: true
	})
	user.findOne({
		name: 'admin'
	}, function(err, admin) {
		if(err) throw err;
		if (!admin){
			adminUser.save(function(err) {
				if (err) throw err;
				console.log('Admin account added successfully...');
			})
		}
	})
})

//Route to register new client
app.post('/registerNewClient', function(req, res) {
	//Tries to find user with input name
	user.findOne({name: req.body.name}, function (err, data) {
		if(err) throw err;
		
		if (!data) {
			const hash_password = bcrypt.hashSync(req.body.password, 8);
			var newClient = new user({
				name: req.body.name,
				password: hash_password,
				admin: false
			});
			newClient.save(function (err) {
				if (err) throw err;
				console.log('New client saved successfully...');
				res.json({ success: true })
			})
		}
		//If user with name already exists
		else if(data){
			res.json({success: false});
		}
	})
});

//Route to authenticate old user (admin OR client)
app.post('/authenticate', function(req, res) {
	//Tries to find user with input name
	user.findOne({
		name: req.body.name
	}, function(err, user) {
		if(err) throw err;

		if(!user) {
			res.json({success:false, message: 'Authentication failed, User not found'});
		}
		else if(user) {
			//If password is incorrect
			if(!bcrypt.compareSync(req.body.password,user.password)) {
				res.json({success: false, message: 'Authentication failed, invalid password'});
			}
			//If password is correct and user is Admin
			else if(req.body.isAdmin === user.admin && bcrypt.compareSync(req.body.password,user.password)){
				const payload = {
					name: user.name
				};

				var token = jwt.sign(payload, app.get('superSecret'), {
					expiresIn: 1440
				});

				res.json({
					success: true,
					message: 'Please use this token',
					token: token
				})
			}
			//If password is correct and User is not an Admin
			else if( !req.body.isAdmin && bcrypt.compareSync(req.body.password,user.password)) {
				const payload = {
					name: user.name
				};

				var token = jwt.sign(payload, app.get('superSecret'), {
					expiresIn : 1440
				});

				res.json({
					success: true,
					message: 'Please use this token',
					token: token
				});
			}
			//If client try to login Admin system
			else{
				res.json({
					success: false,
					message: 'Clients cannot login into the Admin System'
				})
			}
		}
	});
});

//route to verify a token
app.post('/verify', function(req, res) {

	//check post params for token
	var token = req.body.token;

	//decode the token
	if(token){
		//verify secret and check exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if(err){
				return res.json({success: false, message: 'Failed to authenticate token'});
			}
			else {
				//if everything is good, save to request for use in other routes
				return res.json({success: true});
			}
		});
	}
	else {
		//if there is no token, return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided'
		});
	}
});

//heroku deployment
if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));
	// Handle React routing, return all requests to React app
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client/build','index.html'));
	});
}

//socket connections and events
io.on('connection', function(socket){
	console.log("A user connected..." + socket.id)
	
	socket.on('disconnect', function(){
		console.log("User disconnected..." +socket.id)
		const room = user_rooms.getRoomById(socket.id);

		if(room){
			user_rooms.removeUserRoom(room.name);
			io.emit('update user rooms admin',user_rooms.getUserRooms());
		}
		
	});

	//when clients/admin sends a message
	socket.on('chat message', function(data){
		
		const room = user_rooms.getUserRoom(data.roomName);
		if (room){
			room.messages.push(data.message);
			io.emit('chat message', data);
		}
		
		//console.log(user_rooms.getUserRooms());
	});

	//when admin requests for total users data
	socket.on('get users', function(){
		io.emit('update user rooms admin',user_rooms.getUserRooms());
	})

	//when new client logs in
	socket.on('create room', function(roomName){
		user_rooms.addUserRoom(roomName, socket.id);
		user_rooms.addUser(roomName, roomName);
		io.emit('update user rooms', user_rooms.getUserRooms());
		//console.log(user_rooms.getUserRooms());
	})

	//when admin requests for user messages
	socket.on('get messages', function(roomName){
		const room = user_rooms.getUserRoom(roomName);
		io.emit('update user messages', room.messages);
		//console.log(room.messages);
	});
});

server.listen(port,()=>{console.log('Server active on '+ port)});
