/**************************************************
** Terrain model and generation classes.
**************************************************/

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){ // require is unused
    function Player() { // TODO: player Model
        this.x = 0;
        this.y = 0;
    }
    
    return {
        'Player': Player
    }
});