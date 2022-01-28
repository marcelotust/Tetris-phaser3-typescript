import Phaser, { GameObjects } from 'phaser';
import GameStage from './GameStage';
import Piece from './Piece';
import Tile from './Tile';
import TileGrid from './TileGrid';

export default class Block
{
    private scene : Phaser.Scene;
    private piece : Piece;

    public x : number = 0;
    public y : number = 0;

    public targetX : number = 0;
    public targetY : number = 0;

    private blockShapeImage : Phaser.GameObjects.Image;
    private blockImage : Phaser.GameObjects.Image;
    private rect : Phaser.GameObjects.Image;

    public static BLOCK_WIDTH : number = 36;
    public static BLOCK_HEIGHT : number = 30;

    private tile : Tile;

    private tileGrid : TileGrid;
    private animateBreak : boolean = false;
    private countAnimationBreak : number = 0;
    private color : number;

    constructor(scene : Phaser.Scene, tileGrid : TileGrid)
    {
        this.scene = scene;
        this.tileGrid = tileGrid;
    }
    
    create(piece : Piece, color : number = 0xFF0000)
    {
        this.piece = piece;
        this.color = color;
        this.blockShapeImage = this.scene.add.image(0, 0, 'blockShape').setOrigin(0, 0.38);
        this.blockShapeImage.setTint(color);
        this.blockShapeImage.setAlpha(0.5);
        this.blockImage = this.scene.add.image(0, 0, 'block').setOrigin(0, 0.38);

        //this.rect = this.scene.add.image(0, 0, 'rect').setOrigin(0, 0);
    }

    startTile(line : number, column : number)
    {
        var tile : Tile = this.tileGrid.getTileByLineColumn(line, column);
        this.x = this.targetX = tile.area.x;
        this.y = this.targetY = tile.area.y;

        this.updateTile();        
    }

    update(scene:Phaser.Scene)
    {
        this.blockShapeImage.setAlpha(0.5);

        if (!this.piece.isMoving) //consolidate position
        {
            this.consolidatePosition();
        }

        this.x = this.targetX;
        this.y = this.targetY;
      
        this.updateTile();

        /*var graphics = scene.add.graphics(); //draw pivot
        graphics.lineStyle(1, 0x00FF00);
        graphics.strokeRect(this.x, this.y, 2, 2);
        graphics.closePath();
*/
        this.blockShapeImage.x = this.x;
        this.blockShapeImage.y = this.y;
        this.blockImage.x = this.x;
        this.blockImage.y = this.y;
        //this.rect.x = this.x;
        //this.rect.y = this.y;

        this.blockShapeImage.depth = this.tile.getDepth();
        this.blockImage.depth = this.tile.getDepth() +1;
    }

    consolidatePosition()
    {
        this.targetX = this.tile.area.x;
        this.targetY = this.tile.area.y;
        this.blockShapeImage.setAlpha(0.8);
        //this.blockImage.setAlpha(0.0);

        //console.log(">> "+this.tile.line);
        //console.log(">B> "+this.tile.isBusy());
    }

    updateTile() 
    {
        var newTile : Tile | undefined = this.tileGrid.getTileByPosition(this.x, this.y);
        if (newTile)
        {
            this.getTile()?.clear(this);
            newTile.setBlock(this);
            newTile.setBusy(true);
            this.setTile(newTile);
        }

        if (this.animateBreak)
        {
            if (++this.countAnimationBreak < 60)
            {
                if (this.countAnimationBreak % 5 == 0)
                {
                    this.blockShapeImage.setTint(0xFFFFFF);
                    this.blockShapeImage.setAlpha(0.8);
                } else
                {
                    this.blockShapeImage.setTint(this.color);
                    this.blockShapeImage.setAlpha(1);
                }
            } else
            {
                this.countAnimationBreak = 0;
                this.animateBreak = false;
                this.animationBreakCompleted();
            }
        }
    }

    isEnabledToMoveX(xAxis : number)
    {
        if (!this.checkStageLimits(this.x + xAxis))
        {
            return false;
        }
        
        if (this.tile)
        {
            if (xAxis > 0)
            {
                var right : Tile | undefined = this.tileGrid.getRightNeighborTile(this.tile);
                if (right?.isBusy() || !right)
                {
                    if (right?.getBlock() && !this.piece.isBrother(right?.getBlock()))
                    {
                        return false;
                    }
                    
                }
            }

            if (xAxis < 0)
            {
                var left : Tile | undefined = this.tileGrid.getLeftNeighborTile(this.tile);
                if (left?.isBusy() || !left)
                {
                    if (left?.getBlock() && !this.piece.isBrother(left?.getBlock()))
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private checkStageLimits(x : number) : boolean
    {
        if (x < 0) //LEFT LIMIT
        {
            return false;
        }
        if (x + Block.BLOCK_WIDTH > GameStage.COLUMNS * Block.BLOCK_WIDTH) //RIGHT LIMIT
        {
            return false;
        }
        return true;
    }

    isEnabledToMoveY(xAxis : number) : boolean
    {
        var futureTile = this.tileGrid.getTileByPosition(this.x + xAxis, this.y);
        
        if (futureTile)
        {
            var bottom : Tile | undefined = this.tileGrid.getBottomNeighborTile(futureTile);
            
            if (bottom?.isBusy())
            {
                if (bottom?.getBlock() && !this.piece.isBrother(bottom?.getBlock()))
                {
                   return false;
                }
            }

            if (!bottom)
            {
                return false;
            }
        }
        return true;
    }

    isEnabledToMove(x : number, y : number) : boolean
    {
        if (!this.checkStageLimits(x))
        {
            return false;
        }

        var target : Tile | undefined = this.tileGrid.getTileByPosition(x, y);
        if (!target)
        {
            return false;
        } else if (target.isBusy() && !this.piece.isBrother(target.getBlock()))
        {
            return false;
        }
        
        return true;    
    }

    setTile(tile : Tile)
    {
        this.tile = tile;
    }

    getTile() : Tile
    {
        return this.tile;
    }

    break()
    {
        this.animateBreak = true;
    }

    animationBreakCompleted()
    {
        this.deleteBlock();
    }

    deleteBlock()
    {
        this.blockImage.removeFromDisplayList();
        this.blockShapeImage.removeFromDisplayList();
        this.piece.deleteBlock(this);
        this.tileGrid.unblockLine(this.getTile()?.line);
        this.getTile()?.clear(this);
    }

   
}