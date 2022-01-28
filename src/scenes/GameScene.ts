import Phaser from 'phaser';
import GameStage from '../game/GameStage';

export default class HelloWorldScene extends Phaser.Scene
{
    private stage : GameStage;
    private gamePaused : boolean = false;
    
	constructor()
	{
		super('SUPER BLOCOS')
	}

	preload()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('blockShape', 'assets/blockShape.png'); 
        this.load.image('block', 'assets/block.png');
        this.load.image('rect', 'assets/rect.png');    
    }

    create()
    {
        this.stage = new GameStage(this);
        this.stage.create();
    }

    update()
    {
        if (!this.gamePaused)
        {
            // PROPAGATION UPDATE 
            this.stage.update();
        }
    }

    pauseGame()
    {
        this.gamePaused = !this.gamePaused;
    }
}