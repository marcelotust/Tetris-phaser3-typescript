import Phaser from 'phaser';
import Block from './Block';
import GameStage from './GameStage';
import Tile from './Tile';

export default class Piece
{
    private scene : Phaser.Scene;
    private gameStage : GameStage;

    private x : number;
    private y : number;

    private blocks : Array<Block> = [];

    public isMoving : boolean = false;
    private formatsList : Array<Array<number[]>>;
    private currentOrientation : number = 0;

    constructor(scene : Phaser.Scene, gameStage : GameStage)
    {
        this.scene = scene;
        this.gameStage = gameStage;
    }
    
    create(x : number = 0, y : number = 0, color : number = 0xFF0000, format : Array<number[]> = [[1,0],[1,0],[1,1]])
    {
        this.defineAllFormats(format);

        var tile : Tile = this.gameStage.getTileGrid().getTileByLineColumn(x, y);
        this.x = tile.area.x;
        this.y = tile.area.y;

        for (var i = 0; i < format.length; i++)
        {
            for (var j = 0; j < format[i].length; j++)
            {
                if (format[i][j] > 0)
                {
                    var block : Block = new Block(this.scene, this.gameStage.getTileGrid());
                    block.create(this, color);
                    block.startTile(x + i, y + j);
                    this.blocks.push(block);
                }
            }

        }
    }

    private defineAllFormats(format : Array<number[]>)
    {
        this.formatsList = [];
        
        var formatClone : Array<number[]> = format;
        for (var i = 0; i < 4; i++)
        {
            formatClone = formatClone.map((val, index) => formatClone.map(row => row[index]).reverse());
            this.formatsList.push(formatClone);
        }
    }

    update()
    {
        for (var i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i].update(this.scene);
        }
    }

    move(xAxis : number, yAxis : number)
    {
        xAxis *= Block.BLOCK_WIDTH;
        var enabledToMove = true;
        for (var i = 0; i < this.blocks.length; i++)
        {
            if (this.blocks[i].isEnabledToMoveX(xAxis))
            {
                if (!this.blocks[i].isEnabledToMoveY(xAxis))
                {
                    enabledToMove = false;
                    break;
                }

            } else
            {
                enabledToMove = false;
                break;
            }

        }
        
        if (enabledToMove)
        {
            for (var i = 0; i < this.blocks.length; i++)
            {

                this.blocks[i].targetX = this.blocks[i].targetX + xAxis;
                this.blocks[i].targetY = this.blocks[i].targetY + yAxis;
            }
            
            this.x += xAxis;
            this.y += yAxis;
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
    }

    isBrother(block : Block | undefined) : boolean
    {
        for (var i = 0; i < this.blocks.length; i++)
        {
            if (this.blocks[i] == block) //CHECK BROTHERAGEM
            {
                return true;
            }
        }
        return false;
    }

    rotate()
    {
        if (++this.currentOrientation == 4)
        {
            this.currentOrientation = 0;
        }

        var countBlocks : number = 0;
        var enabledToMove = true;
        var targets : Array<number[]> = [];
        for (var i = 0; i < this.formatsList[this.currentOrientation].length; i++)
        {
            for (var j = 0; j < this.formatsList[this.currentOrientation][i].length; j++)
            {
                if (this.formatsList[this.currentOrientation][i][j] > 0)
                {
                    var targetX = this.x + (i * Block.BLOCK_WIDTH);
                    var targetY = this.y + (j * Block.BLOCK_HEIGHT);
                    targets.push([targetX, targetY]);
                    if (!this.blocks[countBlocks++].isEnabledToMove(targetX, targetY))
                    {
                        enabledToMove = false;
                        break;
                    }
                     
                }
            }
        }  
        
        if (enabledToMove)
        {
            for (var i = 0; i < this.blocks.length; i++)
            {

                this.blocks[i].targetX = targets[i][0];
                this.blocks[i].targetY = targets[i][1];
            }
        } 
    }

    deleteBlock(block : Block) 
    {
        for (var i = this.blocks.length; i--;)
        {
            if (this.blocks[i] === block) 
            {
                this.blocks.splice(i, 1)
            }
        }
    }
}