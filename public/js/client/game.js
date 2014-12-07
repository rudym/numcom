
requirejs(['terrain', 'dynamic'], function(terrainModule, dynamicModule) {
    //window.onload = function() {
        RemotePlayer = function (index, game, player, startX, startY) {
        
            var x = startX;
            var y = startY;
        
            this.game = game;
            this.health = 3;
            this.player = player;
            this.alive = true;
        
            this.player = game.add.sprite(x, y, 'enemy');
            
            this.player.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
            this.player.animations.add('stop', [3], 20, true);
        
            this.player.anchor.setTo(0.5, 0.5);
        
            this.player.name = index.toString();
            this.player.body.immovable = true;
            this.player.body.collideWorldBounds = true;
        
            this.player.angle = game.rnd.angle();
        
            this.lastPosition = { x: x, y: y }
        };
        
        RemotePlayer.prototype.update = function() {
            if(this.player.x != this.lastPosition.x || this.player.y != this.lastPosition.y) {
                this.player.play('move');
                this.player.rotation = Math.PI + game.physics.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y);
            } else {
                this.player.play('stop');
            }
        
            this.lastPosition.x = this.player.x;
            this.lastPosition.y = this.player.y;
        };
        
        var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
        var gui = new GameUI(game);
        var terrain;
        
        var landscapeAssets;
        var gemsAssets;
        var doorAssets;
        
        function preload () {
            landscapeAssets = new TilesAssets(game);
            gemsAssets = new GemsAssets(game);
            doorAssets = new DoorAsset(game);
            
            game.load.spritesheet('dude', 'assets/dude.png', 64, 64);
            
            gemsAssets.preload();
            doorAssets.preload();
            landscapeAssets.preload();
            
            gui.preload();
        }
        
        var socket;         // Socket connection
        var pController;
        
        var player;
        
        var enemies;
        
        var currentSpeed = 0;
        var cursors;
        
        
        function create () {
        
            //socket = io.connect('http://martynovr.koding.io:3000');
            
            socket = io();
            pController = new PlayerController(game, socket);
            
            gui.create();
            terrain = game.add.group();
            
            //generator = new terrainModule.TileMapGenerator();
            //var terrainSprites = terrainToSprites(game, landscapeAssets, generator.generateMap());
            //terrain.addChild(terrainSprites);
            
        
            //  Resize our game world to be a 2000 x 2000 square
            //game.world.setBounds(-500, -500, 1000, 1000);
        
            //  Our tiled scrolling background
            //land = game.add.tileSprite(0, 0, 800, 600, 'earth');
            //land.fixedToCamera = true;
        
            //  The base of our player
            var startX = Math.round(Math.random()*(1000)-500),
                startY = Math.round(Math.random()*(1000)-500);
            player = game.add.sprite(startX, startY, 'dude');
            player.anchor.setTo(0.5, 0.5);
            player.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
            player.animations.add('stop', [3], 20, true);
        
            //  This will force it to decelerate and limit its speed
            //player.body.drag.setTo(200, 200);
            //player.body.maxVelocity.setTo(400, 400);
            //player.body.collideWorldBounds = true;
        
            //  Create some baddies to waste :)
            enemies = [];
        
            player.bringToTop();
            
            //  Modify the world and camera bounds
            game.world.setBounds(0, 0, 1920, 1200);
        
            //game.camera.follow(player);
            //game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
            //game.camera.focusOnXY(0, 0);
        
            cursors = game.input.keyboard.createCursorKeys();
        
            // Start listening for events
            setEventHandlers();
        }
        
        var setEventHandlers = function() {
            // Socket connection successful
            socket.on("connect", onSocketConnected);
        
            // Socket disconnection
            socket.on("disconnect", onSocketDisconnect);
        
            // New player message received
            socket.on("new player", onNewPlayer);
        
            // Player move message received
            socket.on("move player", onMovePlayer);
        
            // Player removed message received
            socket.on("remove player", onRemovePlayer);
            
            // Game state message received
            socket.on("gameStateInit", onGameStateInit);
        };
        
        function onGameStateInit(data) {
            console.log("Recieved game state from socket server", data);
            
            var serverTerrain = data['terrain'];
            var serverDynamicMap = data['dynamicMap'];
            
            var rebuiltTerrain = new terrainModule.Terrain(serverTerrain.size);
            for (var i = 0; i < serverTerrain.tiles.length; i++) {
                rebuiltTerrain.tiles[i].copyFrom(serverTerrain.tiles[i]);
            }
            
            var terrainSprites = terrainToSprites(game, landscapeAssets, rebuiltTerrain);
            terrain.addChild(terrainSprites);
            
            console.log('Server dynamic map', serverDynamicMap);

            var dynamicMapSprite = dynamicMapToSprites(game, gemsAssets, doorAssets, serverDynamicMap);
            terrain.addChild(dynamicMapSprite);
        }
        
        // Socket connected
        function onSocketConnected() {
            console.log("Connected to socket server");
        
            // Send local player data to the game server
            socket.emit("new player", {x: player.x, y:player.y});
        }
        
        // Socket disconnected
        function onSocketDisconnect() {
            console.log("Disconnected from socket server");
        }
        
        // New player
        function onNewPlayer(data) {
            console.log("New player connected: "+data.id);
        
            // Add new player to the remote players array
            // enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y));
        }
        
        // Move player
        function onMovePlayer(data) {
            
            var movePlayer = playerById(data.id);
        
            // Player not found
            if (!movePlayer) {
                console.log("Player not found: "+data.id);
                return;
            }
        
            // Update player position
            movePlayer.player.x = data.x;
            movePlayer.player.y = data.y;
            
        }
        
        // Remove player
        function onRemovePlayer(data) {
        
            var removePlayer = playerById(data.id);
        
            // Player not found
            if (!removePlayer) {
                console.log("Player not found: "+data.id);
                return;
            }
        
            removePlayer.player.kill();
        
            // Remove player from array
            enemies.splice(enemies.indexOf(removePlayer), 1);
        
        }
        
        function update () {
            gui.update();
            pController.update();
            
            /*for (var i = 0; i < enemies.length; i++)
            {
                if (enemies[i].alive)
                {
                    enemies[i].update();
                    game.physics.collide(player, enemies[i].player);
                }
            }
        
            if (cursors.left.isDown)
            {
                player.angle -= 4;
            }
            else if (cursors.right.isDown)
            {
                player.angle += 4;
            }
        
            if (cursors.up.isDown)
            {
                //  The speed we'll travel at
                currentSpeed = 300;
            }
            else
            {
                if (currentSpeed > 0)
                {
                    currentSpeed -= 4;
                }
            }
        
            if (currentSpeed > 0)
            {
                game.physics.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);
            
                player.animations.play('move');
            } 
            else 
            {
                player.animations.play('stop');
            }
        
            land.tilePosition.x = -game.camera.x;
            land.tilePosition.y = -game.camera.y;
        
            if (game.input.activePointer.isDown)
            {
                if (game.physics.distanceToPointer(player) >= 10) {
                    currentSpeed = 300;
                
                    player.rotation = game.physics.angleToPointer(player);
                }
            }
        
            socket.emit("move player", {x: player.x, y:player.y});
            */
        }
        
        function render () {
            //debug purpose
            game.debug.cameraInfo(game.camera, 32, 32);
        }
        
        // Find player by ID
        function playerById(id) {
            var i;
            for (i = 0; i < enemies.length; i++) {
                if (enemies[i].player.name == id)
                    return enemies[i];
            }
            
            return false;
        }

//    };
});


    
