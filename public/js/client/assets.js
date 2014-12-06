function TilesAssets (game, prefix) {
    prefix = prefix || 'land_';

    this.tilesFactory = {
        'coldwatergrass': new TileSheetFactory(game, prefix + 'coldwatergrass', 'assets/coldwatergrass.png', 5, 6),
        'icegrass': new TileSheetFactory(game, prefix + 'icegrass', 'assets/icegrass.png', 5, 6),
        'plowed_soil': new TileSheetFactory(game, prefix + 'plowed_soil', 'assets/plowed_soil.png', 5, 6),
        'tallgrass': new TileSheetFactory(game, prefix + 'tallgrass', 'assets/tallgrass.png', 5, 6),
        'wheat': new TileSheetFactory(game, prefix + 'wheat', 'assets/wheat.png', 5, 6),
    };
    
    this.preload = function () {
        for (var k in this.tilesFactory) {
            this.tilesFactory[k].preload();
        }
    }
}

function TileSheetFactory(game, key, path, cols, rows, size) {
    this.size = size || 32;
    this.cols = cols;
    this.rows = rows;
    
    this.preload = function () {
        game.load.spritesheet(key, path, this.size, this.size);
    }
    
    this.generateSprite = function(game, x, y, i, j) {
        var index = (i - 1) + (j - 1) * this.cols; // 2, 3 =>  11-1
        if (index > this.cols * this.rows - 1) {
            return undefined;
        }
        var s = new Phaser.Sprite(game, x, y, key, index);
            s.anchor.setTo(0, 0);
        return s;
    }
}
