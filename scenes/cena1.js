// Então, essa classe MainMenuScene é basicamente a tela principal do meu jogo, onde tudo começa.
export default class Menu extends Phaser.Scene {
    // No construtor, estou só dando um nome para a cena, pra poder chamar ela depois.
    constructor() {
        super({ key: 'Menu' });
    }

    // Aqui é onde eu carrego as imagens que vou usar mais tarde.
    preload() {
        this.load.image('background', "assets/back.jpeg");  // Imagem de fundo
        this.load.image('logo', "assets/logoFi.png");        // A logo do jogo
        this.load.image('startButton', "assets/start1.png"); // E o botão de começar
    }

    // Agora, é aqui que eu coloco as coisas na tela.
    create() {
        // Coloco a imagem de fundo no meio da tela (600, 300) e deixo ela com o tamanho normal.
        this.add.image(600, 300, 'background').setScale(1); 

        // A logo aparece lá em cima, um pouco menor.
        this.add.image(600, 100, 'logo').setScale(0.3); 

        // O botão de start fica bem no centro e eu deixo ele interativo (dá pra clicar).
        let button = this.add.image(600, 300, 'startButton').setInteractive().setScale(0.2);
        
        // Quando eu clicar no botão, a cena do jogo começa.
        button.on('pointerdown', () => {
            this.scene.start('Jogo'); // Aqui, eu chamo a cena do jogo
        });
    }
}
