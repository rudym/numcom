/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var requirejs = require('requirejs');
var util = require("util"),					                // Utility resources (logging, object inspection, etc)
	Player = require("./Player").Player,		            // Player class
	level = requirejs('terrain');	// Game level class


/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players,	// Array of connected players
	Game;


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);
}

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	}

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
}

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id});

	// Send existing players to the new player
	util.log('Broadcasting data about new player');
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id});
	}

	// Add new player to the players array
	players.push(newPlayer);
	
	if (typeof Game === "undefined" && players.length >= 0) {
		util.log('Generate level');
		var mapgenerator = new level.TileMapGenerator();
		socket.emit("gameStateInit", mapgenerator.generateMap());
		//Game = mapgenerator.generateMap();
	}
}

// Player has moved
function onMovePlayer(data) {
    util.log("Current boardstate is: "+Game.getGameState());
	// Find player in array
	var movePlayer = playerById(this.id);
    
	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	}

	// Update player move
	util.log("Player: "+movePlayer+ " pushed on index: " +data.index);
	//Game.setTurn(movePlayer.id, data.index);

	// Broadcast updated position to connected socket clients
	//this.broadcast.emit("gameState", tttGame.getGameState());
	socket.emit("gameState", Game.getGameState());
}


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	}

	return false;
}


/**************************************************
** RUN THE GAME
**************************************************/
//init();

/**************************************************
** GAME INITIALISATION
**************************************************/
module.exports = function init(io) {
	// Create an empty array to store players
	players = [];

	// Set up Socket.IO to listen on port 8000
	socket = io;

	/* Configure Socket.IO
	socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});*/

	// Start listening for events
	setEventHandlers();
};