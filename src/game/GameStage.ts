import Phaser, { GameObjects, Scene } from 'phaser';
import Piece from './Piece'; 
import Block from './Block'; 
import Tile from './Tile';
import TileGrid from './TileGrid';
import GameScene from './../scenes/GameScene';
import PieceFactory from './PieceFactory';

export default class GameStage
{
    private scene : GameScene;
    private tileGrid : TileGrid;
    
    private pieceFactory : PieceFactory;
    private pieces : Array<Piece>;
    private activePiece : Piece;

    private speed : number = 0.5;
    private acceleration : number = 0;

    private cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    private keyLeftPress : number = 0;
    private keyRightPress : number = 0;
    
    public static LINES : number = 23;
    public static COLUMNS : number = 10;
    public static INTERVAL_MOVE_X_AXIS : number = 10;

    private countNextRound : number = 0;

    private rotateLoadout : number = 0;

    constructor(scene : GameScene)
    {
        this.scene = scene;
    }

    create()
    {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        var keyObj = this.scene.input.keyboard.addKey('SPACE');  // Get key object
        keyObj.on('up', this.onKeySpaceUp, this);
        
        //this.scene.add.image(500, 400, 'sky');

        this.tileGrid = new TileGrid(this.scene);
        
        this.pieceFactory = new PieceFactory(this.scene, this);
        this.pieces = [];
        this.createPiece();
    }

    onKeySpaceUp() {
        this.scene.pauseGame();
    }

    update() : boolean
    {
        // INPUT
        if (!this.cursors)
        {
            return false;
        }
        
        this.inputManager();

        // LEVEL BEHAVIOR
        this.activePiece.move(0, this.speed);

        if (!this.activePiece.isMoving)
        {
            if (this.checkScore())
            {
                //waiting cleanup
            } else {
            
                this.countNextRound++;
                if (this.countNextRound == 10)
                {
                    this.createPiece();
                    this.countNextRound = 0;
                }
            }
        }

        // PROPAGATION UPDATE
        for (var i = 0; i < this.pieces.length; i++)
        {
            this.pieces[i].update();
        }
        return true;
    }

    checkScore() : boolean
    {
        
        if (this.tileGrid.hasFullLine())
        {
            var tiles : Array<Tile> = this.tileGrid.getCurrentFullLine();
            for (var i = 0; i < tiles.length; i++)
            {
                tiles[i].getBlock()?.break();
            }
            
            return true;
        }
        return false;
    }

    createPiece()
    {
        var piece : Piece = this.pieceFactory.createRandomPiece(0, 4);
        this.activePiece = piece;
        this.pieces.push(piece);
    }

    private inputManager() 
    {
        if (this.cursors.left?.isUp || this.keyLeftPress > GameStage.INTERVAL_MOVE_X_AXIS)
        {
            this.keyLeftPress = 0;
        }
        if (this.cursors.right?.isUp || this.keyRightPress > GameStage.INTERVAL_MOVE_X_AXIS)
        {
            this.keyRightPress = 0;
        }

        if (this.cursors.left?.isDown)
        {
            if (this.keyLeftPress == 0)
            {
                this.activePiece.move(-1, 0);
            }
            this.keyLeftPress += 1;
        }
        if (this.cursors.right?.isDown)
        {
            if (this.keyRightPress == 0)
            {
                this.activePiece.move(+1, 0);
            }
            this.keyRightPress += 1;
        }
        if (this.cursors.down?.isDown)
        {
            if (this.acceleration < 10) {
                this.acceleration += 1;
            }
            this.activePiece.move(0, +this.acceleration);
        } else
        {
            this.acceleration = 0;
        }
        if (this.cursors.up?.isDown && this.rotateLoadout > 10)
        {
            this.activePiece.rotate();
            this.rotateLoadout = 0;
        }
        this.rotateLoadout++;
    }

    getTileGrid() : TileGrid
    {
        return this.tileGrid;
    }
}
