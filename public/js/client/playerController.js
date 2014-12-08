function PlayerController(game, socket, guiGroup) {
    var pc = this;
    var cursors = game.input.keyboard.createCursorKeys();
    var num = "";
    
    //game.input.onDown.addOnce(updateText, this);
       
    var text = game.add.text(game.world.centerX, game.world.centerY, "", {
        font: "125px Arial",
        fill: "#000000",
        align: "center"
    });
    text.fixedToCamera = true;
    text.cameraOffset.setTo(100, 250);

    //text.anchor.setTo(game.camera.x, game.camera.y);
    
    guiGroup.add(text);
    
    this.preload = function () {
    };
    
    this.create = function() {
    };
    
    this.update = function () {
        //  click da mouse
        // console.log("Start pc");
        if (game.input.mousePointer.isDown)
        {
            console.log("Mouse event");
            socket.emit("player clicked", "Player has clicked down mouse button");
        }
        else
        {
            // console.log("No Mouse event");
        }
        
        //  For example this checks if the up or down keys are pressed and moves the camera accordingly.
        if (cursors.up.isDown)
        {
            socket.emit("player clicked", "Player has clicked up button");
        }
        
        //camera works
        if (cursors.up.isDown)
        {
             game.camera.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            game.camera.y += 4;
        }
        if (cursors.left.isDown)
        {
            game.camera.x -= 4;
        }
        else if (cursors.right.isDown)
        {
           game.camera.x += 4;
        }
        
        //  Capture all key presses
        game.input.keyboard.addCallbacks(this, null, null, keyPress);

    };
    
    function updateText() {
        text.setText(num);
        text.z = 100;
    }
    
    
    function keyPress(char) {
        if( char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) { // NUMBERS
            num += char;
        }
        else if(char.charCodeAt(0) == 13) { //ENTER
            socket.emit("numcom", num);
            num = "";
        }
        updateText();
    }   
}