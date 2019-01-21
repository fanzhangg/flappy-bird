//`window.innerWidth`
// - get CSS viewport (a window on the screen) `@media (width) which includes scroll bars
// - mobile values may be wrongly scaled down to the visual viewport and be smaller
// - zoom may cause values to be 1px of due to native rounding
// - `undefined` in IE8
// - logical resolution
// `document.documentElement.clientWidth
// - = CSS viewport width minus scrollbar width
// - = @media (width) when there is no scrollbar
// - = `jQuery(window).width()` which jQuery calls the browser viewport
// - available cross-browser
// - inaccurate if doc type is missing
// reference: https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript

// some devices have a higher Device Pixel Ratio
// actual resolution = logical resolution * DPR
// reference: https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
const PIXEL_RATIO = window.devicePixelRatio;
const INNER_WIDTH = window.innerWidth;
const CLIENT_WIDTH = document.documentElement.clientWidth;
let width = INNER_WIDTH * PIXEL_RATIO;
// `let` allows you to declare variables that are limited in scope to the block, statement, or expression on which is used
// `let` allows you to declare variables that are limited in scope to the block, statement, or expression on which is used
// `var` defines a variable globally, or locally to an entire function regardless of block scope
const INNER_HEIGHT = window.innerHeight;
const CLIENT_HEIGHT = document.documentElement.clientHeight;
let height = INNER_WIDTH * PIXEL_RATIO;

 if (height > 750) {
     width = 500;
     height = 750;
     var game = new Phaser.Game(width, height, Phaser.AUTO, 'screen')
 }
 else {
     var game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'screen');
 }

const SCALE_RATIO = window.devicePixelRatio;


const ROTATE_DEGREE = 10;
const PIPE_HEIGHT = 600;
const GAP = 150;

// Create the mainState that will contain the game
const mainState = {
    preload: function () {
        // This function will be excuted at the beginning
        // Load the image and sounds
        game.load.image('bird', 'assets/bird.png');

        // Load the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');

        // Load the jumping sound
        game.load.audio('jump', 'assets/jump.wav');
    },

    create: function () {
        // This function is called after the preload functions
        // Change the background color of the game to blue
        game.stage.backgroundColor = "#71c5cf";

        // Set the physics fileSystem
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the center of the screen
        let birdX = width / 2 - 25;
        let birdY = height / 2 - 25;
        this.bird = game.add.sprite(birdX, birdY, 'bird');
        // this.bird.scale.setTo(SCALE_RATIO, SCALE_RATIO);

        // Change the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        // Add physics to the Bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make this fall
        this.bird.body.gravity.y = 1000;

        // Call the 'jump' function when the space key is hit
        const SPACE_KEY = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        SPACE_KEY.onDown.add(this.jump, this);
        // Create an empty group
        this.pipes = game.add.group();

        // Call the `addRowOfPipes()` function every 1.5 s
        // Add a timer in the `create()` function
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        // Add the score label on the left corner of the user interface
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            {font: "30px Arial", fill: "#ffffff"});

        // add the sound in the game
        this.jumpSound = game.add.audio('jump');
    },

    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        game.physics.arcade.overlap(
            this.bird, this.pipes, this.hitPipe, null, this);
        if (this.bird.y < 0 || this.bird.y > height)
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

        // Play the sound effect
        this.jumpSound.play();
    },

    // Restart the game
    restartGame: function () {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },


    addOnePipe: function (x, y) {
        // Create a pipe at the position x and y
        let pipe = game.add.sprite(x, y, 'pipe');
        // pipe.scale.setTo(SCALE_RATIO, SCALE_RATIO);

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
        // Randomly pick a number between GAP and height - 50
        // This will be the x position of the bottom pipe
        const bottomX = Math.ceil(Math.random() * (height - GAP - 100) + GAP + 50);

        // Add the bottom pipe
        this.addOnePipe(width, bottomX);

        // Add the top pipe
        this.addOnePipe(width, bottomX - GAP - PIPE_HEIGHT);

        // Increase the score by 1 each time a new pip is created
        this.score += 1;
        this.labelScore.text = this.score;
    },

    hitPipe: function () {
        // If the bird has already hit a pipe, do nothing
        // The bird is already falling off the screen
        if (!this.bird.alive)
            return null;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipe from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    }
};

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
