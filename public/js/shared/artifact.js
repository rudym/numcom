/**************************************************
** Artifacts model and generation classes.
**************************************************/

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){ // require is unused
    function Artifact(tile, name, artifactType, artifactOption, scoreBonus) { // gem or door Model
        this.x = tile.x;
        this.y = tile.y;
        this.tile = tile;
        
        this.scoreBonus = scoreBonus || 0; // score bonus to give to player for grabbing the artifact
        
        this.name = name || 'red gem'; // to show 'user123 collected the red gem'
        this.artifactType = artifactType || 'gems'; // used by renderer
        this.artifactOption = artifactOption || 'red';
    }
    
    function Door (tile) {
        this.x = tile.x;
        this.y = tile.y;
        this.tile = tile;
        
        this.scoreBonus = 100000; // score bonus to give to player for grabbing the artifact
        
        this.name = 'The Door'; // to show 'user123 collected the red gem'
        this.artifactType = 'door'; // used by renderer
        this.artifactOption = '';
    }
    
    return {
        'Artifact': Artifact,
        'Door': Door
    }
});