// Top-down food collection game with pixel art style

let player, cursors, score = 0, scoreText, gameOver = false;
let foods, goblins;

function preload() {
    // Load pixel art sprites
    this.load.image('player', 'assets/player.png');
    this.load.image('goblin', 'assets/goblin.png');
    this.load.image('banana', 'assets/banana.png');
    this.load.image('apple', 'assets/apple.png');
    this.load.image('pineapple', 'assets/pineapple.png');
}

function create() {
    // Background with SNES vibe
    this.cameras.main.setBackgroundColor('#2c2c54');
    
    // Create food group
    foods = this.physics.add.group();
    
    // Create goblin enemies group
    goblins = this.physics.add.group();
    
    // Create player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(2); // Pixel art style scaling
    
    // Create food items
    for (let i = 0; i < 8; i++) {
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(50, 550);
        const foodTypes = ['banana', 'apple', 'pineapple'];
        const type = Phaser.Math.RND.pick(foodTypes);
        const food = foods.create(x, y, type);
        food.setScale(2);
    }
    
    // Create goblins
    for (let i = 0; i < 4; i++) {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        const goblin = goblins.create(x, y, 'goblin');
        goblin.setScale(2);
        goblin.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        goblin.setBounce(1);
        goblin.setCollideWorldBounds(true);
    }
    
    // WASD controls
    cursors = this.input.keyboard.addKeys('W,S,A,D');
    
    // Score display
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Courier New'
    });
    
    // Instructions
    this.add.text(16, 550, 'WASD to move • Collect food • Avoid goblins', {
        fontSize: '16px',
        fill: '#ffff00',
        fontFamily: 'Courier New'
    });
    
    // Collisions
    this.physics.add.overlap(player, foods, collectFood, null, this);
    this.physics.add.overlap(player, goblins, hitGoblin, null, this);
}

function update() {
    if (gameOver) return;
    
    // Player movement with WASD
    const speed = 200;
    let velocityX = 0;
    let velocityY = 0;
    
    if (cursors.A.isDown) velocityX = -speed;
    else if (cursors.D.isDown) velocityX = speed;
    
    if (cursors.W.isDown) velocityY = -speed;
    else if (cursors.S.isDown) velocityY = speed;
    
    player.setVelocity(velocityX, velocityY);
    
    // Randomize goblin movement occasionally
    goblins.children.entries.forEach(goblin => {
        if (Math.random() < 0.01) {
            goblin.setVelocity(
                Phaser.Math.Between(-150, 150),
                Phaser.Math.Between(-150, 150)
            );
        }
    });
}

function collectFood(player, food) {
    food.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // Check if all food collected
    if (foods.countActive(true) === 0) {
        this.add.text(400, 300, 'YOU WIN!', {
            fontSize: '64px',
            fill: '#00ff00',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        gameOver = true;
    }
}

function hitGoblin(player, goblin) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    
    this.add.text(400, 300, 'GAME OVER', {
        fontSize: '64px',
        fill: '#ff0000',
        fontFamily: 'Courier New'
    }).setOrigin(0.5);
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2c2c54',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize game
const game = new Phaser.Game(config);