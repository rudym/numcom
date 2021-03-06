/**************************************************
** Terrain model and generation classes.
**************************************************/

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require){ // require is unused

    function TileGrid (size, tileCls) {
        if (typeof this.tiles === 'undefined') {
            this.tiles = [];
        } 
        

        this.size = size;
        
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                var tile = {};
                tileCls.call(tile, col, row);
                this.tiles.push(tile);
            }
        }
        
        this.tile = function (x, y) {
            return this.tiles[x + y * size];
        };
        
        this.setTile = function (x, y, value) {
            this.tiles[x + y * size] = value;
        };
        
        this.getSize = function () { 
            return size; 
        }
        
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
            var walkableGround = indexOfXYIndex(this.terrainSpriteIndices[0], 
                    this.terrainSpriteIndices[1], WALKABLE_TILES_INDICES) >= 0;
                    
            var walkableFlora = true;
            if (this.floraType) {
                walkableFlora = indexOfXYIndex(this.floraSpriteIndices[0], 
                    this.floraSpriteIndices[1], WALKABLE_TILES_INDICES) >= 0
            }
            if (walkableFlora && walkableGround) {
                this.walkable = true;
            } else {
                this.walkable = false;
            }
        }
        
        this.walkable = false;
    
        this.clean = function() {
            this.state = '';
            this.payload = {};
        };
        
        this.copyFrom = function(tileObj) {
            this.x = tileObj.x;
            this.y = tileObj.y;
            this.state = tileObj.state;
            this.payload = tileObj.payload;
        
            this.terrainType = tileObj.terrainType;
            this.terrainSpriteIndices = tileObj.terrainSpriteIndices; 
        
            this.floraType = tileObj.floraType;
            this.floraSpriteIndices = tileObj.floraSpriteIndices;
            
            this.updateWalkable();
        };
    }
    
    
    function Terrain (size) {
        TileGrid.call(this, size, Tile); // call to super
        
        console.log('test tile:', this.tile(1,1));
        
        this.getAllWalkableTiles = function () { //todo: use LoDash's filter or map function
            var result = [];
            for (var i = this.tiles.length - 1; i >= 0; i--) {
                var tile = this.tiles[i];
                if (tile.walkable) {
                    result.push(tile);
                }
            }
            return result;
        };
    }
    

    var TileMapGenerator = function () {
        
        function addWheat (terrain, tx0, ty0, tx1, ty1) {
            
            //terrain under wheat is walkable one common ground
            for (var i = tx0; i <= tx1; i++) {
                for (var j = ty0; j <= ty1; j++) {
                    terrain.tile(i, j).terrainType = 'icegrass'; //topleft
                    terrain.tile(i, j).terrainSpriteIndices = [5, 1];
                }
            }
            
            
            terrain.tile(tx0, ty0).floraType = 'wheat'; //topleft
            terrain.tile(tx0, ty0).floraSpriteIndices = [1,3];
            for (var i = tx0 + 1; i < tx1; i++) { // top border
                terrain.tile(i, ty0).floraType = 'wheat';
                terrain.tile(i, ty0).floraSpriteIndices = [2,3];
            }
            terrain.tile(tx1, ty0).floraType = 'wheat'; //topright
            terrain.tile(tx1, ty0).floraSpriteIndices = [3,3];
            
            
            terrain.tile(tx0, ty1).floraType = 'wheat'; //bottomleft
            terrain.tile(tx0, ty1).floraSpriteIndices = [1,5];
            for (var i = tx0 + 1; i < tx1; i++) { // bottom border
                terrain.tile(i, ty1).floraType = 'wheat';
                terrain.tile(i, ty1).floraSpriteIndices = [2,5];
            }
            terrain.tile(tx1, ty1).floraType = 'wheat'; //bottomright
            terrain.tile(tx1, ty1).floraSpriteIndices = [3,5];
        
            // the wheat center
            for (var i = tx0 + 1; i < tx1 + 1; i++) {
                for (var j = ty0 + 1; j < ty1; j++) {
                    terrain.tile(i, j).floraType = 'wheat';
                    terrain.tile(i, j).floraSpriteIndices = [2, 4];
                }
            }
            
            //left and right borders
            for (var i = ty0 + 1; i < ty1; i++) {
                terrain.tile(tx0, i).floraType = 'wheat';
                terrain.tile(tx0, i).floraSpriteIndices = [1, 4];
                terrain.tile(tx1, i).floraType = 'wheat';
                terrain.tile(tx1, i).floraSpriteIndices = [3, 4];
            }
        }
        
        function addLake (terrain, tx0, ty0, tx1, ty1) {
            terrain.tile(tx0, ty0).terrainType = 'icegrass'; //topleft
            terrain.tile(tx0, ty0).terrainSpriteIndices = [1,3];
            for (var i = tx0 + 1; i < tx1; i++) { // top border
                terrain.tile(i, ty0).terrainType = 'icegrass';
                terrain.tile(i, ty0).terrainSpriteIndices = [2,3];
            }
            terrain.tile(tx1, ty0).terrainType = 'icegrass'; //topright
            terrain.tile(tx1, ty0).terrainSpriteIndices = [3,3];
            
            
            terrain.tile(tx0, ty1).terrainType = 'icegrass'; //bottomleft
            terrain.tile(tx0, ty1).terrainSpriteIndices = [1,5];
            for (var i = tx0 + 1; i < tx1; i++) { // bottom border
                terrain.tile(i, ty1).terrainType = 'icegrass';
                terrain.tile(i, ty1).terrainSpriteIndices = [2,5];
            }
            terrain.tile(tx1, ty1).terrainType = 'icegrass'; //bottomright
            terrain.tile(tx1, ty1).terrainSpriteIndices = [3,5];
        
            // the lake center
            for (var i = tx0 + 1; i < tx1 + 1; i++) {
                for (var j = ty0 + 1; j < ty1; j++) {
                    terrain.tile(i, j).terrainType = 'icegrass';
                    terrain.tile(i, j).terrainSpriteIndices = [2, 4];
                }
            }
            
            //left and right borders
            for (var i = ty0 + 1; i < ty1; i++) {
                terrain.tile(tx0, i).terrainType = 'icegrass';
                terrain.tile(tx0, i).terrainSpriteIndices = [1, 4];
                terrain.tile(tx1, i).terrainType = 'icegrass';
                terrain.tile(tx1, i).terrainSpriteIndices = [3, 4];
            }
        }
        
        this.generateMap = function (size) { //laguna
        //  size is ignored now
            size = size || 32;
            // size = size || 8;
            
            var NUM_LAKES = 4;
            // var NUM_LAKES = 0;
            var NUM_WHEATS = 4;
            // var NUM_WHEATS = 0;
            
            var terrain = new Terrain(size);
            for (var i = 0; i < size; i++) {
                for (var j = 0; j < size; j++) {
                    var tile = terrain.tile(i, j);
                    tile.terrainType = 'icegrass';
                    tile.terrainSpriteIndices = [5, 1];
                }
            }
            
            var lakes = [];
            
            function intersect(rects, rect) {
                for (var i = 0; i < rects.length; i++) {
                    var rectToTest = rects[i];
                    
                    var X1W1 = rect[2];
                    var X2W2 = rectToTest[2];
                    var X1 = rect[0];
                    var X2 = rectToTest[0];
                    var Y1H1 = rect[3];
                    var Y2H2 = rectToTest[3];
                    var Y1 = rect[1];
                    var Y2 = rectToTest[1];
                    
                    if (!(X1W1<X2 || X2W2<X1 || Y1H1<Y2 || Y2H2<Y1)) {
                        return true;
                    }
                }
            }
            
            for (var i = 0; i <= NUM_LAKES; i++) {
                var rx = Math.floor(Math.random() * (size - 8));
                var ry = Math.floor(Math.random() * (size - 8));
                var s = Math.floor(Math.random() * 5 + 3);
                
                var rect = [rx, ry, rx + s, ry + s];
                
                if (intersect(lakes, rect)) {
                    continue;
                }
                
                lakes.push(rect);
                
                addLake(terrain, rx, ry, rx + s, ry + s);
            }
            
            var wheats = [];
            
            for (var i = 0; i <= NUM_WHEATS; i++) {
                var rx = Math.floor(Math.random() * (size - 8));
                var ry = Math.floor(Math.random() * (size - 8));
                var s = Math.floor(Math.random() * 5 + 3);
                var rect = [rx, ry, rx + s, ry + s];
                
                if (intersect(lakes, rect) || intersect(wheats, rect)) {
                    continue;
                }
                
                wheats.push(rect);
                
                addWheat(terrain, rx, ry, rx + s, ry + s);
            }
            
            for (i = 0; i < size; i++) {
                for (j = 0; j < size; j++) {
                    tile = terrain.tile(i, j);
                    tile.updateWalkable();
                }
            }
            return terrain;
        };
    };
    
    
    
   

    // Define which variables and methods can be accessed
    return {
        TileGrid: TileGrid,
        Terrain: Terrain,
        Tile: Tile,
        TileMapGenerator: TileMapGenerator,
    };
});

