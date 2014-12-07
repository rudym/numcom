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
    function Player(startX, startY) {
        var x = startX,
        	y = startY,
        	score = 0,
        	gems = [],
        	id;
        
        // Getters and setters
        var getX = function() {
        	return x;
        };
        
        var getY = function() {
        	return y;
        };
        
        var setX = function(newX) {
        	x = newX;
        };
        
        var setY = function(newY) {
        	y = newY;
        };
        
        var getScore = function() {
        	return score;
        };
        
        var addScore = function(newScore) {
        	score += newScore;
        };
        
        var getGems = function() {
            return gems;    
        }
        
        var addGem = function(gem) {
            gems.push(gem);
        }
        
        
        // Define which variables and methods can be accessed
        return {
        	getX: getX,
        	getY: getY,
        	setX: setX,
        	setY: setY,
        	getScore: getScore,
        	addScore: addScore,
        	getGems: getGems,
        	addGem: addGem,
        	id: id
        };
    }
    
    return {
        'Player': Player
    }
});