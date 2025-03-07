export default class CenaJogo extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('fundo', '../assets/fundo1.jpeg');
        this.load.image('chao', '../assets/pista2.png');
        this.load.image('trofeu', '../assets/tro.png');
        this.load.image('bomba', '../assets/bomb.png');
        this.load.spritesheet('personagem', '../assets/mcQueen.png', { frameWidth: 160, frameHeight: 70 });
    }

    create() {
        this.add.image(1000, 220, 'fundo');
        this.plataformas = this.physics.add.staticGroup();
        let plataformasPosicoes = [
            { x: 200, y: 700 }, { x: 500, y: 290 }, { x: 50, y: 450 },
            { x: 880, y: 450 }, { x: 100, y: 600 }, { x: 500, y: 600 },{ x: 700, y: 600 },
            { x: 1000, y: 600 }
        ];
        plataformasPosicoes.forEach(pos => {
            this.plataformas.create(pos.x, pos.y, 'chao').setScale(1).refreshBody();
        });

        this.jogador = this.physics.add.sprite(100, 450, 'personagem');
        this.jogador.setBounce(0.2).setCollideWorldBounds(true);

        this.anims.create({ key: 'esquerda', frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'parado', frames: [{ key: 'personagem', frame: 3 }], frameRate: 20 });
        this.anims.create({ key: 'direita', frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });

        this.teclas = this.input.keyboard.createCursorKeys();
        this.trofeus = this.physics.add.group({ key: 'trofeu', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } });
        this.trofeus.children.iterate(trofeu => {
            trofeu.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.bombas = this.physics.add.group();
        this.textoPontuacao = this.add.text(100, 16, 'Pontuação: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(this.jogador, this.plataformas);
        this.physics.add.collider(this.trofeus, this.plataformas);
        this.physics.add.collider(this.bombas, this.plataformas);
        this.physics.add.overlap(this.jogador, this.trofeus, this.coletarTrofeu, null, this);
        this.physics.add.collider(this.jogador, this.bombas, this.colidiuComBomba, null, this);
    }

    update() {
        if (this.fimDeJogo) return;
        if (this.teclas.left.isDown) {
            this.jogador.setVelocityX(-160);
            this.jogador.anims.play('esquerda', true);
        } else if (this.teclas.right.isDown) {
            this.jogador.setVelocityX(160);
            this.jogador.anims.play('direita', true);
        } else {
            this.jogador.setVelocityX(0);
            this.jogador.anims.play('parado');
        }
        if (this.teclas.up.isDown && this.jogador.body.touching.down) {
            this.jogador.setVelocityY(-350);
        }
    }

    coletarTrofeu(jogador, trofeu) {
        trofeu.disableBody(true, true);
        this.pontuacao = (this.pontuacao || 0) + 10;
        this.textoPontuacao.setText('Pontuação: ' + this.pontuacao);
        if (this.trofeus.countActive(true) === 0) {
            this.trofeus.children.iterate(trofeu => {
                trofeu.enableBody(true, trofeu.x, 0, true, true);
            });
            let x = (this.jogador.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            let bomba = this.bombas.create(x, 16, 'bomba');
            bomba.setBounce(1).setCollideWorldBounds(true);
            bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomba.allowGravity = false;
        }
    }

    colidiuComBomba(jogador, bomba) {
        this.physics.pause();
        jogador.setTint(0xff0000);
        jogador.anims.play('parado');
        this.fimDeJogo = true;
    }
}
