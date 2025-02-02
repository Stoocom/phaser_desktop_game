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
        this.load.image('sky', './assets/images/sky.png');
        this.load.image('ground', './assets/images/platform.png');
        this.load.image('star', './assets/images/star.png');
        this.load.image('bomb', './assets/images/bomb.png');
        this.load.spritesheet('dude', './assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
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

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(player2, platforms);
        cursors = this.input.keyboard.createCursorKeys();
        // add stars

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        stars.children.iterate(function (child) {
        
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });
        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.overlap(player2, stars, collectStar, null, this);

        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, null, this);
    }

    function update ()
    {
        if (cursors.left.isDown)
            {
                player.setVelocityX(-160);
    
                player.anims.play('left', true);
            }
            else if (cursors.right.isDown)
            {
                player.setVelocityX(160);
    
                player.anims.play('right', true);
            }
            else if (keyA.isDown)
            {
                player2.setVelocityX(-160);
                player2.anims.play('left', true);
            }
            else if (keyD.isDown)
            {
                player2.setVelocityX(160);
                player2.anims.play('right', true);
            }
            else if (keyW.isDown && player2.body.touching.down)
            {
                player2.setVelocityY(-330);
            }
            else
            {
                player.setVelocityX(0);
    
                player.anims.play('turn');
                player2.setVelocityX(0);
    
                player2.anims.play('turn');
            }
    
            if (cursors.up.isDown && player.body.touching.down)
            {
                player.setVelocityY(-330);
            }
    }

    function collectStar (player, star)
    {
        console.log('player', player);
        star.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
        console.log('collectStar', stars.countActive(true));

        if (stars.countActive(true) === 0) 
        {
            console.log(true);
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        
            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        
            let bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    function hitBomb (player, bomb)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        // gameOver = true;
    }