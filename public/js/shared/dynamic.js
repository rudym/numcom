if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){ // require is unused
    var artifacts = require('artifact');
    
    function DynamicMap (terrain) { // container for dynamic objects
        this.players = []; // players list
        this.artifacts = []; // gems and doors
        this.terrain = terrain;

        this.newPlayerCallbacks = [];
        this.newArtifactCallbacks = [];

        this.spawnNewPlayer = function (player) { // callback on client-side should add sprites, on the server side can send events to clients
           this.players.push(player);
           if (this.newPlayerCallbacks.length > 0) {
               for (var i = 0; i < this.newPlayerCallbacks.length; i++) {
                   var callback = this.newPlayerCallbacks[i];
                   callback(this, player);
               }
           }
        };
        
        this.spawnNewArtifact = function (artifact) { // callback on client-side should add sprites, on the server side can send events to clients
            this.artifacts.push(artifact);
            if (this.newArtifactCallbacks.length > 0) {
               for (var i = 0; i < this.newArtifactCallbacks.length; i++) {
                   var callback = this.newArtifactCallbacks[i];
                   callback(this, artifact);
               }
           }
        };
        
    }
    
    function DynamicMapGenerator (terrain) {
        this.terrain = terrain;
        this.gemsAndScores = {
            'red': 100,
            'yellow': 1000,
            'green': 4000,
            'magenta': 16000,
            'blue': 320000
        };
        
        

        function getRandomGemName() {
            var gemNames = ['red', 'yellow', 'green', 'magenta', 'blue'];
            return gemNames[Math.floor(Math.random() * gemNames.length)];
        }

        this.generateArtifacts = function(dynamicMap) {
            var walkableTiles = dynamicMap.terrain.getAllWalkableTiles();
            var maxGemsToGenerate = Math.floor(walkableTiles.length * 0.2); //
            
            var probability = 0.2; // probability of generating gem in this tile
            
            for (var i = 0; i < maxGemsToGenerate; i++) {
                if (Math.random() <= probability) {
                    var tileIndex = Math.floor(Math.random() * walkableTiles.length);
                    var tile = walkableTiles[tileIndex];
                    walkableTiles.splice(tileIndex, 1);
                    var color = getRandomGemName();
                    var name = color + ' gem';
                    var artifact = new artifacts.Artifact(tile, name, 'gems', color, this.gemsAndScores[color]);
                    dynamicMap.spawnNewArtifact(artifact);
                }
            }
            
            var doorTile = walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
            
            var door = new artifacts.Door(doorTile);
            dynamicMap.spawnNewArtifact(door);
        };
        
        this.generateDynamicMap = function (terrain) {
            var dynamicMap = new DynamicMap(terrain);
            this.generateArtifacts(dynamicMap);
            return dynamicMap;
        }
    }
    
    return {
        'DynamicMap': DynamicMap,
        'DynamicMapGenerator': DynamicMapGenerator
    }
});