import * as Phaser from "phaser";

    console.log('DOM готов!');
    let config = {
        type: Phaser.AUTO,
        // backgroundColor: "#FFFFFF",
        transparent: true,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity:{y:300, x: 0},
                debug: false
            }
        },
        scene: {
            init: init,
            preload: preload,
            create: create,
            update: update
        }
    };

    let game = new Phaser.Game(config);
    let platforms;
    let player;
    let player2;
    let cursors;
    let stars;
    let score = 0;
    let scoreText;
    let bombs;

    let keyA;
    let keyS;
    let keyD;
    let keyW;

    function init ()
    {
        console.log('init');
        // game.canvas.style.display = "none";
    }

    function preload ()
    {
        console.log('preload');
        this.load.image('sky', '../assets/images/sky.png');
        this.load.image('ground', '../assets/images/platform.png');
        this.load.image('star', '../assets/images/star.png');
        this.load.image('bomb', '../assets/images/bomb.png');
        this.load.spritesheet('dude', '../assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
        // this.add.image(400, 300, 'sky');
    }

    function create ()
    {
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        // create background
        this.add.image(400, 300, 'sky');

        // create shelves
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        // platforms.create(0, 568, 'ground').setOrigin(0, 0);
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        // create player
        player = this.physics.add.sprite(100, 450, 'dude');

        player2 = this.physics.add.sprite(400, 450, 'dude');

        player.setBounce(0.4);
        player.setCollideWorldBounds(true);

        player2.setBounce(0.4);
        player2.setCollideWorldBounds(true);
    }

    function update ()
    {
    }