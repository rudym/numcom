 function terrainToSprites (game, tilesAssets, terrain) {
    var group = new Phaser.Group(game);
    for (var i = 0; i < terrain.size; i++) {
        for (var j = 0; j < terrain.size; j++) {
            var tile = terrain.tile(i, j);
            group.addChild(tileToSprite(game, tilesAssets, tile));
        }
    }
    return group;
}
        
function tileToSprite(game, tilesAssets, tile) {
    var group = new Phaser.Group(game);
    var terrainSprite = tilesAssets.tilesFactory[tile.terrainType].generateSprite(
            game,
            tile.x * 32, 
            tile.y * 32, 
            tile.terrainSpriteIndices[0],
            tile.terrainSpriteIndices[1]
        );
    group.addChild(terrainSprite);
    
    if (tile.floraType) {
        var floraSprite = tilesAssets.tilesFactory[tile.floraType].generateSprite(
            game,
            tile.x * 32, 
            tile.y * 32, 
            tile.floraSpriteIndices[0],
            tile.floraSpriteIndices[1]
        );
        group.addChild(floraSprite);
    }

    return group;
}