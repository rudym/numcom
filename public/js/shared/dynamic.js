if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){ // require is unused
    function DynamicMap (terrain) { // container for dynamic objects
        this.players = []; // players list
        this.artifacts = [];
        this.terrain = terrain;
    }
    
    return {
        'DynamicMap': DynamicMap
    }
});