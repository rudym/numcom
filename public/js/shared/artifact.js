/**************************************************
** Artifacts model and generation classes.
**************************************************/

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){ // require is unused
    function Artifact(name, artifactType, scoreBonus) { // gem or door Model
        this.x = 0;
        this.y = 0;
        
        this.scoreBonus = scoreBonus || 0; // score bonus to give to player for grabbing the artifact
        
        this.name = name || 'red gem'; // to show 'user123 collected the red gem'
        this.artifactType = artifactType || 'gems'; // used by renderer
    }
    
    return {
        'Artifact': Artifact
    }
});