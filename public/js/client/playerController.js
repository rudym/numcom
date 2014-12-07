function PlayerController(game, socket) {
    var pc = this;
    var cursors = game.input.keyboard.createCursorKeys();
    var num = "";
    
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
    
    
    function keyPress(char) {
        if( char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) { // NUMBERS
            num += char;
        }
        else if(char.charCodeAt(0) == 13) { //ENTER
            socket.emit("numcom", num);
            num = "";
        }
    }   
}