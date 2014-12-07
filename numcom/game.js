/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var requirejs = require('requirejs');
var util = require("util"),					                // Utility resources (logging, object inspection, etc)
	level = requirejs('terrain'), // terrain module
	playerModule = requirejs('player'),
	artifactModule = requirejs('artifact'),
	dynamic = requirejs('dynamic')
	;	


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
	//util.log("New player has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);
	
	client.on("player clicked", onPlayerClicked);
	
	client.on("numcom", onNumCom);
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


var generatedTerrain;
var generatedDynamicMap;

// New player has joined
function onNewPlayer(data) {
    
    util.log('New player: ' + this.id);
    
	if (typeof generatedTerrain === "undefined" && players.length >= 0) {
		util.log('Generate level');
		generatedTerrain = (new level.TileMapGenerator()).generateMap();
		generatedDynamicMap = (new dynamic.DynamicMapGenerator()).generateDynamicMap(generatedTerrain);
	}
	
	
	var walkableTiles = generatedTerrain.getAllWalkableTiles();
    var playerTile = walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
	
	// Create a new player (ME)
	var newPlayer = new playerModule.Player(this.id, playerTile);

	socket.emit("gameStateInit", {
        'terrain': generatedTerrain,
        'dynamicMap': generatedDynamicMap,
        'player': { 'id': newPlayer.id, tile: newPlayer.tile }});

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {'id': newPlayer.id, tile: newPlayer.tile});

	// Send existing players to the new player
	util.log('Broadcasting data about new player');
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {'id': existingPlayer.id, tile: existingPlayer.tile});
	}

	// Add new player to the players array
	players.push(newPlayer);
	

}

// Player has clicked
function onPlayerClicked(data) {
    //util.log(data);
	
	this.broadcast.emit("gameState", "Here goes delta data with changed state");
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

// Number command event
function onNumCom(data) {
    util.log("Number commander event started: " + data);
    
    // Find player in array
	var movePlayer = playerById(this.id);
    
	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	}
	
	var arrayPath = [1, 2, 3];
	this.emit("move player", {id: movePlayer.id, arPath: arrayPath});
	
	
	this.emit("DEBUGTOCLIENTCONSOLE", data);
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