function Terrain(size) {
    var tiles = [];
    
    this.size = size;
    
    for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
            tiles.push(new Tile(col, row));
        }
    }
    
    this.tile = function (x, y) {
        return tiles[x + y * size];
    };
    
    this.left = function (tile) {
        if (tile.x - 1 < 0) return undefined;
        return this.tile(tile.x - 1, tile.y);
    };
    
    this.right = function (tile) {
        if (tile.x + 1 > size - 1) return undefined;
        return this.tile(tile.x + 1, tile.y);
    };
    
    this.top = function (tile) {
        if (tile.y - 1 < 0) return undefined;
        return this.tile(tile.x, tile.y - 1);
    };
    
    this.bottom = function (tile) {
        if (tile.y + 1 > size - 1) return undefined;
        return this.tile(tile.x, tile.y + 1);
    };
}


function Tile (
                x, y, state, payload, 
                terrainType, terrainSpriteIndices,
                floraType, floraSpriteIndices
                ) {
    this.x = x;
    this.y = y;
    this.state = state || '';
    this.payload = payload || {};

    this.terrainType = terrainType || '';
    this.terrainSpriteIndices = terrainSpriteIndices; 
    if (!this.terrainSpriteIndices) this.terrainSpriteIndices = [0, 0];

    this.floraType = floraType || undefined;
    this.floraSpriteIndices = floraSpriteIndices;
    if (!this.floraSpriteIndices) this.floraSpriteIndices = [0, 0];
    
    
    var WALKABLE_TILES_INDICES = [[5, 1], [5, 4]];
    
    function indexOfXYIndex(i, j, indices) {
        for (var l = indices.length - 1; l >= 0; l--) {
            var indexArr = indices[l]; // [x, y]
            if (i == indexArr[0] && j == indexArr[1]) {
                return l;
            }
        }
        return -1;
    }
    
    this.updateWalkable = function () {
        if (!this.floraType) {
            if (indexOfXYIndex(this.terrainSpriteIndices[0], 
                this.terrainSpriteIndices[1], WALKABLE_TILES_INDICES) >= 0) {
                this.walkable = true;
            }
        } else {
            this.walkable = false;
        }
    }
    
    this.walkable = false;
    
    

    this.clean = function() {
        this.state = '';
        this.payload = {};
    };
}


function TileMapGenerator() {
    this.generateMap = function (size) { //laguna
        var terrain = new Terrain(5);
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                var tile = terrain.tile(i, j);
                tile.terrainType = 'icegrass';
                tile.terrainSpriteIndices = [5, 1];
            }
        }
        
        terrain.tile(1,1).terrainSpriteIndices = [1, 3];
        terrain.tile(2,1).terrainSpriteIndices = [2, 3];
        terrain.tile(3,1).terrainSpriteIndices = [3, 3];
        
        terrain.tile(1,2).terrainSpriteIndices = [1, 4];
        terrain.tile(2,2).terrainSpriteIndices = [2, 4];
        terrain.tile(3,2).terrainSpriteIndices = [3, 4];
        
        terrain.tile(1,3).terrainSpriteIndices = [1, 5];
        terrain.tile(2,3).terrainSpriteIndices = [2, 5];
        terrain.tile(3,3).terrainSpriteIndices = [3, 5];
        
        for (i = 0; i < 5; i++) {
            for (j = 0; j < 5; j++) {
                tile = terrain.tile(i, j);
                tile.updateWalkable();
            }
        }
        return terrain;
    }
}
