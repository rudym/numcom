if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){ // require is unused
    var artifacts = require('artifact');
    
    function DynamicMap (terrain) { // container for dynamic objects
        this.players = []; // players list
        this.artifacts = []; // gems and doors
        this.terrain = terrain;
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

        this.generateGems = function(dynamicMap) {
            var walkableTiles = dynamicMap.terrain.getAllWalkableTiles();
            var maxGemsToGenerate = Math.floor(walkableTiles.length * 0.2); //
            
            var probability = 0.1; // probability of generating gem in this tile
            
            for (var i = 0; i < maxGemsToGenerate; i++) {
                if (Math.random() <= probability) {
                    var tileIndex = Math.floor(Math.random() * walkableTiles.length);
                    var tile = walkableTiles[tileIndex];
                    walkableTiles.splice(tileIndex, 1);
                    var color = getRandomGemName();
                    var name = color + ' gem';
                    var artifact = new artifacts.Artifact(tile, name, 'gems', color, this.gemsAndScores[color]);
                    dynamicMap.artifacts.push(artifact);
                }
            }
        };
        
        this.generateDynamicMap = function (terrain) {
            var dynamicMap = new DynamicMap(terrain);
            this.generateGems(dynamicMap);
            return dynamicMap;
        }
    }
    
    return {
        'DynamicMap': DynamicMap,
        'DynamicMapGenerator': DynamicMapGenerator
    }
});