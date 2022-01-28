import Phaser, { GameObjects, Scene } from 'phaser';
import Piece from './Piece'; 
import GameStage from './GameStage'; 
import GameScene from './../scenes/GameScene';

export default class PieceFactory
{
    private scene : GameScene;
    private gameStage : GameStage;
    private classicFormats : Array<Array<number[]>>;
    private colors : Array<number>;
    private indexColor : number = 0;
    
    constructor(scene : GameScene, gameStage: GameStage)
    {
        this.scene = scene;
        this.gameStage = gameStage;
        this.defineClassicFormats();
        this.defineColors();
    }

    private defineClassicFormats()
    {
        this.classicFormats = [
            //[[1,1],[0,0]]
            //[[0,1,0,0,0],[0,2,0,0,0],[0,3,0,0,0],[0,4,0,0,0],[0,5,0,0,0]]
            [[1,0,0],[2,0,0],[3,4,0]],
            [[1,2,3],[4,0,0],[0,0,0]],
            [[1,2,0],[0,3,4],[0,0,0]],
            [[0,1,0,0],[0,2,0,0],[0,3,0,0],[0,4,0,0]],
            [[1,0,0],[2,3,0],[0,4,0]],
            [[1,2],[3,4]]
        ]
    }

    private getRandomFormat() : Array<number[]>
    {
        return this.classicFormats[Math.floor(Math.random() * (this.classicFormats.length))];
    }

    private defineColors()
    {
        this.colors = [0xfe325a, 0xff3206, 0xffa000, 0xc4c300, 0x00ba5a, 0x2d8ae5, 0x4a41ff, 0xa032ff, 0xcf21d8];
    }

    private getNextColor() : number
    {
        if (this.indexColor == this.colors.length -1)
        {
            this.indexColor = 0;
        }
        return this.colors[this.indexColor++];
    }    

    private createPiece(x : number, y : number, color : number, format : Array<number[]>) : Piece
    {
        var piece : Piece = new Piece(this.scene, this.gameStage);
        piece.create(x, y, color, format);
        return piece;
    }

    createRandomPiece(x : number, y : number) : Piece
    {
        var colors : Array<number> = [0xFF00EE, 0xFFEE00, 0x00FFEE, 0x3333FF];
        var format : Array<number[]> = this.getRandomFormat();
        var piece : Piece = this.createPiece(x, y, this.getNextColor(), format);
        return piece;
    }
}