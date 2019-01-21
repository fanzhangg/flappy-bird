const WIDTH = 400;
const HEIGHT = 490;
const ROTATE_DEGREE = 20;

// Create the mainState that will contain the game
var mainState = {
    preload: function () {
        // This function will be excuted at the beginning
        // Load the image and sounds
        game.load.image('bird', 'assets/bird.png');

        // Load the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
    },

    create: function () {
        // This function is called after the preload functions
        // Change the background color of the game to blue
        game.stage.backgroundColor = "#71c5cf";

        // Set the physics fileSystem
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        // Change the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        // Add physics to the Bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make this fall
        this.bird.body.gravity.y = 1000;

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        // Create an empty group
        this.pipes = game.add.group();

        // Call the `addRowOfPipes()` function every 1.5 s
        // Add a timer in the `create()` function
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff"});
    },

    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        game.physics.arcade.overlap(
            this.bird, this.pipes, this.hitPipe, null, this);
        if (this.bird.y < 0 || this.bird.y > HEIGHT)
            this.restartGame();

        // Rotates downwards 1 degree per time up to a certain degree
        if (this.bird.angle < ROTATE_DEGREE)
            this.bird.angle += 1;
    },

    // Make the bird jump
    jump: function () {
        // Stop the bird from jumping when it is dead
        if (!this.bird.alive)
            return null;

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        game.add.tween(this.bird).to({angle: -20}, 100).start();
    },

    // Restart the game
    restartGame: function () {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    addOnePipe: function (x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i !== hole && i !== hole + 1)
                this.addOnePipe(400, i * 60 + 10);
        // Increase the score by 1 each time a new pip is created
        this.score += 1;
        this.labelScore.text = this.score;
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // The bird is already falling off the screen
        if (!this.bird.alive)
            return null;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipe from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        }, this);
    }
};

// Initialize parser, and create a WIDTH by HEIGHT game
var game = new Phaser.Game(WIDTH, HEIGHT);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
