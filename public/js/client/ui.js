function GameUI(game) {
    var ui = this;
    
    this.preload = function () {
        
    };
    
    this.create = function() {
        ui.score = 0;
        ui.scoreText = game.add.text(16, 16, 'score: 0',  { fontSize: '32px', fill: '#000' });
    };
    
    this.update = function () {
        
    };
}