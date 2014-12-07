function gemToSprite (game, gemsAssets, artifact) {
    if (artifact.artifactType != 'gems') { return undefined; } // work only with 'gems' artifactType 
    return gemsAssets.generateGem(artifact.artifactOption, artifact.tile.x * 32, artifact.tile.y * 32)
}

function dynamicMapToSprites (game, gemsAssets, doorAsset, dynamicMap) {
    var group = new Phaser.Group(game);
    
    for (var i = 0; i < dynamicMap.artifacts.length; i++) {
        var artifact = dynamicMap.artifacts[i];
        if (artifact.artifactType == 'gems') { // only gems are supported now TODO:
            group.addChild(gemToSprite(game, gemsAssets, artifact));
        } else if (artifact.artifactType == 'door') {
            group.addChild(doorAsset.doorToSprite(artifact, artifact.tile.x * 32, artifact.tile.y * 32));
        }
    }
    
    return group;
}



function playerToSprite(game, player, x, y) {
    var player = game.add.sprite(x, y, 'dude');
    
    player.anchor.setTo(0.5, 0.5);
    
    player.animations.add('moveDown', [0,1,2], 8, true);
    player.animations.add('moveLeft', [12,13,14], 8, true);
    player.animations.add('moveRight', [24,25,26], 8, true);
    player.animations.add('moveUp', [36, 37, 38], 8, true);
    player.animations.add('stop', [3], 20, true);

    return player;
}


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