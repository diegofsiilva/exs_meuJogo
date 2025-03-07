// Essa é a cena do jogo, onde a ação acontece de verdade!
export default class Jogo extends Phaser.Scene {
    // O construtor só define o nome da cena, igual ao anterior.
    constructor() {
        super({ key: 'Jogo' });
    }

    // aqui é onde eu carrego tudo o que vai ser usado no jogo.
    preload() {
        this.load.image('fundo', '../assets/fundo1.jpeg');  // Imagem de fundo
        this.load.image('chao', '../assets/pista2.png');    // Imagem do chão
        this.load.image('trofeu', '../assets/tro.png');      // Imagem do troféu
        this.load.image('bomba', '../assets/bomb.png');      // Imagem da bomba
        this.load.spritesheet('personagem', '../assets/mcQueen.png', { frameWidth: 160, frameHeight: 70 }); // Personagem principal
    }

    // aqui é onde coloco os itens na tela e começo a configurar a física.
    create() {
        this.add.image(1000, 220, 'fundo').setScale(1.1);  // fundo do jogo
        this.plataformas = this.physics.add.staticGroup(); // grupo de plataformas fixas
        let plataformasPosicoes = [
            { x: 200, y: 700 }, { x: 500, y: 290 }, { x: 50, y: 450 },
            { x: 880, y: 450 }, { x: 100, y: 600 }, { x: 500, y: 600 },{ x: 700, y: 600 },
            { x: 1000, y: 600 }
        ];

        // crio as plataformas usando as posições que defini acima.
        plataformasPosicoes.forEach(pos => {
            this.plataformas.create(pos.x, pos.y, 'chao').setScale(1).refreshBody();
        });

        // coloco o jogador na tela e dou a ele umas propriedades como a física.
        this.jogador = this.physics.add.sprite(100, 450, 'personagem');
        this.jogador.setBounce(0.2).setCollideWorldBounds(true);

        // crio as animações do personagem: esquerda, direita e parado.
        this.anims.create({ key: 'esquerda', frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'parado', frames: [{ key: 'personagem', frame: 3 }], frameRate: 20 });
        this.anims.create({ key: 'direita', frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });

        // configuro as teclas de movimentação.
        this.teclas = this.input.keyboard.createCursorKeys();

        // crio o grupo de troféus e boto eles pra quicar.
        this.trofeus = this.physics.add.group({ key: 'trofeu', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } });
        this.trofeus.children.iterate(trofeu => {
            trofeu.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // crio o grupo de bombas, que depois vou usar no jogo.
        this.bombas = this.physics.add.group();

        // crio a pontuação e coloco ela na tela.
        this.textoPontuacao = this.add.text(100, 16, 'Pontuação: 0', { fontSize: '32px', fill: '#000' });

        // Coloco a física entre os objetos: jogador, plataformas, troféus e bombas.
        this.physics.add.collider(this.jogador, this.plataformas);
        this.physics.add.collider(this.trofeus, this.plataformas);
        this.physics.add.collider(this.bombas, this.plataformas);
        this.physics.add.overlap(this.jogador, this.trofeus, this.coletarTrofeu, null, this);
        this.physics.add.collider(this.jogador, this.bombas, this.colidiuComBomba, null, this);
    }

    // atualiza a tela o tempo todo, com as movimentações do jogador.
    update() {
        if (this.fimDeJogo) return; // Se o jogo acabou, não faz nada.
        if (this.teclas.left.isDown) {
            this.jogador.setVelocityX(-160); // Movimenta o jogador pra esquerda
            this.jogador.anims.play('esquerda', true); // Anima a personagem indo pra esquerda
        } else if (this.teclas.right.isDown) {
            this.jogador.setVelocityX(160); // Movimenta o jogador pra direita
            this.jogador.anims.play('direita', true); // Anima a personagem indo pra direita
        } else {
            this.jogador.setVelocityX(0); // Se não pressionar as setas, o jogador para.
            this.jogador.anims.play('parado'); // Coloca o personagem parado
        }
        if (this.teclas.up.isDown && this.jogador.body.touching.down) {
            this.jogador.setVelocityY(-350); // Se apertar pra cima e o jogador estiver no chão, ele pula.
        }
    }

    // Função que acontece quando o jogador coleta um troféu.
    coletarTrofeu(jogador, trofeu) {
        trofeu.disableBody(true, true); // Desativa o troféu depois de coletado
        this.pontuacao = (this.pontuacao || 0) + 10; // Adiciona 10 pontos
        this.textoPontuacao.setText('Pontuação: ' + this.pontuacao); // Atualiza a pontuação na tela
        if (this.trofeus.countActive(true) === 0) { // Se todos os troféus foram coletados
            // Reativa os troféus e coloca bombas aleatórias no mapa.
            this.trofeus.children.iterate(trofeu => {
                trofeu.enableBody(true, trofeu.x, 0, true, true);
            });
            let x = (this.jogador.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            let bomba = this.bombas.create(x, 16, 'bomba');
            bomba.setBounce(1).setCollideWorldBounds(true);
            bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomba.allowGravity = false; // As bombas não caem.
        }
    }

    // Quando o jogador colide com a bomba, o jogo acaba.
    colidiuComBomba(jogador, bomba) {
        this.physics.pause(); // Para tudo.
        jogador.setTint(0xff0000); // O jogador fica vermelho.
        jogador.anims.play('parado'); // Para a animação do jogador.
        this.fimDeJogo = true; // O jogo termina.
    }
}
