
const express = require("express");
const app = express();
const fs = require('fs');

/*var options = {
	key: fs.readFileSync('/etc/letsencrypt/live/quemute.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/quemute.com/fullchain.pem'),
   
}*/
const server = require("http").createServer(app);
const io = require("socket.io").listen(server, {pingTimeout: 30000, pingInterval: 30000});
server.listen(3000, () => console.log('listening on *:3000'));

global.users = {};
global.connectedUsers = {};

io.sockets.on("connection", (socket) => {
	console.log("User Connected.");
	socket.on("joinroute", (user, routeName, currentRoute) => joinRoute(socket, user, routeName, currentRoute));
	socket.on("disconnect", () => {
		console.log(users[socket.id]);
		if(users[socket.id]){
			var currentRoute = users[socket.id].current_route;
			var user = users[socket.id];
			leaveRoute(socket, currentRoute, user);
		}
		/*var currentRoute = users[socket.id].current_route;
		var user = users[socket.id];
		leaveRoute(socket, currentRoute, user);*/
		
	});
	socket.on("updateuserlocation", (user) => updateLocation(socket, user));
	socket.on("leaveroute", (currentRoute, user) => leaveRoute(socket, currentRoute, user));
	//socket.on("updateLocation", (user) => updateLocation(socket, user));
});

function joinRoute(socket, user, routeName, currentRoute){
	//socket.join(routeName);

	var userId = user.email;
	
	if(connectedUsers[userId]){
		socket.emit("useralreadyconnected");
		return;
	}

	socket.join(routeName);
	connectedUsers[userId] = {current_route: routeName, connections: 0};

	

	users[socket.id] = user;

	socket.broadcast.to(routeName).emit("userjoined", user, socket.id);

	sendUsersInRoute(socket, routeName);

    /*var usersInRoute = {};
    var clientsInRoom =  io.of('/').adapter.clients([routeName], function(error,clients){
        console.log(clients);
        for(var index in clients){
        	var userSocketId = clients[index];
        	if((userSocketId != socket.id)|| userAlreadyConnected){
        		usersInRoute[userSocketId] = users[userSocketId];
        	}
        	//usersInRoute[userSocketId] = users[userSocketId];
        }
        socket.emit("joinroute", usersInRoute);
    });*/
}

function sendUsersInRoute(socket, routeName){
	var usersInRoute = {};
    var clientsInRoom =  io.of('/').adapter.clients([routeName], function(error,clients){
        console.log(clients);
        for(var index in clients){
        	var userSocketId = clients[index];
        	if(userSocketId != socket.id){
        		usersInRoute[userSocketId] = users[userSocketId];
        	}
        	//usersInRoute[userSocketId] = users[userSocketId];
        }
        socket.emit("joinroute", usersInRoute);
    });
}

function leaveRoute(socket, currentRoute, user){
	socket.leave(currentRoute);
	var userType = user.user_type;
	var userId = user.email;
	//var connections = connectedUsers[userId].connections;
	delete users[socket.id];
	delete connectedUsers[userId];
	/*if(connections < 2){
		delete connectedUsers[userId];
	}else{
		connectedUsers[userId].connections--;
	}*/
	socket.broadcast.to(currentRoute).emit("userleft", socket.id, userType);
	socket.leave();
}

function updateLocation(socket, user){
	var currentRoute = user.current_route;
	var socketId = socket.id;
	var userType = user.user_type;
	if(userType == "COMMUTER"){
		socket.broadcast.to(currentRoute).emit("updateuserlocation", user, socketId);
	}else if(userType == "DRIVER"){
		socket.broadcast.to(currentRoute).emit("updatedriverlocation", user, socketId);
	}
}

/*function updateDriverLocation(socket, user){
	var 
}*/
