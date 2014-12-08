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


function numbersGridToSprite(game, numbersGrid) {
    var group = new Phaser.Group(game);
  
    for (var i = 0; i < numbersGrid.size; i++) {
        for (var j = 0; j < numbersGrid.size; j++) {
            var tileNumber = numbersGrid.tile(i, j);
            if (tileNumber > 0) {
                var rectSprite = new Phaser.Sprite(game, i * 32, j * 32, 'tilerect');
                rectSprite.alpha = 0.1;
                var text = new Phaser.Text(game, i * 32 + 4, j * 32 + 4, 
                    tileNumber.toString());
                    text.fontSize = 12;
                    text.font = 'Arial';
                    text.alpha = 0.6;
                    text.addColor('#fefcfc', 0);
                group.addChild(text);
                group.addChild(rectSprite);
            }
        }
    }
    return group;
}

function playerToSprite(game, x, y) {
    var sprite = game.add.sprite(x, y, 'dude');

    sprite.anchor.setTo(0.0, 0.0);
    
    sprite.animations.add('moveDown', [0,1,2], 8, true);
    sprite.animations.add('moveLeft', [12,13,14], 8, true);
    sprite.animations.add('moveRight', [24,25,26], 8, true);
    sprite.animations.add('moveUp', [36, 37, 38], 8, true);
    sprite.animations.add('stop', [3], 20, true);

    return sprite;
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
