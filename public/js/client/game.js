window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
    
    var gui = new GameUI(game);
   
    var terrain;
    var landscapeAssets = new TilesAssets(game);

    function preload () {
        landscapeAssets.preload();
        gui.preload();
    }

    function create () {
        gui.create();
        
        terrain = game.add.group();

        generator = new TileMapGenerator();
        var terrainSprites = terrainToSprites(game, landscapeAssets, generator.generateMap());
        
        terrain.addChild(terrainSprites);
    }
    
    function update() {
        gui.update();
    }
}