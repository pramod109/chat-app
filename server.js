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

mongoose.connect(config.database, () => {
	console.log('Successfully connected to mongodb database...');
});

app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

const apiRoutes = express.Router();
app.use(cors());

//Route to register new client
app.post('/registerNewClient', function(req, res) {

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
		else if(data){
			res.json({success: false});
		}
	})
});

//Route to authenticate old user (admin OR client)
app.post('/authenticate', function(req, res) {

	user.findOne({
		name: req.body.name
	}, function(err, user) {
		if(err) throw err;

		if(!user) {
			res.json({success:false, message: 'Authentication failed, User not found'});
		}
		else if(user) {
			
			if(!bcrypt.compareSync(req.body.password,user.password)) {
				res.json({success: false, message: 'Authentication failed, invalid password'});
			}
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
			else{
				res.json({
					success: false,
					message: 'Clients cannot login into the Admin System'
				})
			}
		}
	});
});

//route middleware to verify a token
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
	
	socket.on('chat message', function(data){
		
		const room = user_rooms.getUserRoom(data.roomName);
		if (room){
			room.messages.push(data.message);
			io.emit('chat message', data);
		}
		
		console.log(user_rooms.getUserRooms());
	});

	socket.on('get users', function(){
		io.emit('update user rooms admin',user_rooms.getUserRooms());
	})

	socket.on('create room', function(roomName){
		user_rooms.addUserRoom(roomName, socket.id);
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

server.listen(3001,()=>{console.log('Server active on 3001...')});
