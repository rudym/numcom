function gemToSprite (game, gemsAssets, artifact) {
    if (artifact.artifactType != 'gems') { return undefined; } // work only with 'gems' artifactType 
    return gemsAssets.generateGem(artifact.artifactOption, artifact.tile.x * 32, artifact.tile.y * 32)
}

function dynamicMapToSprites (game, gemsAssets, doorAsset, dynamicMap) {
    var group = new Phaser.Group(game);
    
    var artifactsGroup = new Phaser.Group(game);
    
    for (var i = 0; i < dynamicMap.artifacts.length; i++) {
        var artifact = dynamicMap.artifacts[i];
        if (artifact.artifactType == 'gems') { // only gems are supported now TODO:
            artifactsGroup.addChild(gemToSprite(game, gemsAssets, artifact));
        } else if (artifact.artifactType == 'door') {
            artifactsGroup.addChild(doorAsset.doorToSprite(artifact, artifact.tile.x * 32, artifact.tile.y * 32));
        }
    }
    group.addChild(artifactsGroup);
    
    group.addChild(numbersGridToSprite(game, dynamicMap.numbersGrid));
    
    return group;
}

function numberToSprite(game, number, i, j) {
    Phaser.Text(game, 16, 16, 'score: 0',  { fontSize: '32px', fill: '#000' });
}

<<<<<<< HEAD
function numbersGridToSprite(game, numbersGrid) {
    var group = new Phaser.Group(game);
    for (var i = 0; i < numbersGrid.size; i++) {
        for (var j = 0; j < numbersGrid.size; j++) {
            var tileNumber = numbersGrid.tile(i, j);
            var text = new Phaser.Text(game, i * 32, j * 32, tileNumber.toString(), { fontSize: '32px', fill: '#000' });
            group.addChild(text);
        }
    }
    return group;
}

function playerToSprite(game, player, x, y) {
    var playerSprite = game.add.sprite(x, y, 'dude');
=======
function playerToSprite(game, x, y) {
    var player = game.add.sprite(x, y, 'dude');
>>>>>>> 2430b58559cd80a6b80b9d0063b09fe002be9ece
    
    playerSprite.anchor.setTo(0.5, 0.5);
    
    playerSprite.animations.add('moveDown', [0,1,2], 8, true);
    playerSprite.animations.add('moveLeft', [12,13,14], 8, true);
    playerSprite.animations.add('moveRight', [24,25,26], 8, true);
    playerSprite.animations.add('moveUp', [36, 37, 38], 8, true);
    playerSprite.animations.add('stop', [3], 20, true);

    return playerSprite;
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
