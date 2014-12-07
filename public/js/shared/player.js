/**************************************************
** Terrain model and generation classes.
**************************************************/

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){ // require is unused
/**************************************************
** GAME PLAYER CLASS
**************************************************/
    function Player(tile) {
        this.id = undefined;
        this.tile = tile;
        this.score = 0;
        this.gems = [];

        this.addScore = function(newScore) {
        	this.score += newScore;
        };

        this.addGem = function(gem) {
            gems.push(gem);
        }
    }
    
    
    // p = new Plyaer();
    // p.getScore, p.id, 
    
    return {
        'Player': Player
    }
});