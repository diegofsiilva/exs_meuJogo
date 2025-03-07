export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('background', '../assets/back.jpeg');
        this.load.image('logo', '../assets/logoFi.png');
        this.load.image('startButton', '../assets/start1.png');
    }

    create() {
        this.add.image(600, 300, 'background').setScale(1);
        this.add.image(600, 100, 'logo').setScale(0.3);
        let button = this.add.image(600, 300, 'startButton').setInteractive().setScale(0.2);
        
        button.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
