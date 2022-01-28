import Phaser, { GameObjects } from 'phaser';
import Block from './Block';
import GameStage from './GameStage';
import Tile from './Tile';

export default class TileGrid
{
    private scene : Phaser.Scene;
    private tiles : Array<Tile> = [];
    private countDepth : number;
    private currentFullLine : Array<Tile>;
    private currentFullLineIndex : number;
    
    constructor(scene : Phaser.Scene)
    {
        this.scene = scene;
        
        this.createTilesGrid();
        this.drawTilesGrid();
    }

    private createTilesGrid()
    {
        this.tiles = [];
        var lines = GameStage.LINES;
        var columns = GameStage.COLUMNS;
        this.countDepth = lines * columns * 5; //5 depth between tiles
        
        var tileWidth = Block.BLOCK_WIDTH;
        var tileHeight = Block.BLOCK_HEIGHT;
        for (var i = 0; i < lines; i++)
        {
            for (var j = 0; j < columns; j++)
            {   
                var area = new Phaser.Geom.Rectangle(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
                var tile = new Tile(this.scene, area, i, j, this.countDepth);
                this.tiles.push(tile);

                this.countDepth -= 5;
                //console.log("this.countDepth "+this.countDepth);
            }
        }        
    }

    private drawTilesGrid()
    {
        var graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x202020);

        for (var i = 0; i < this.tiles.length; i++)
        {
            graphics.strokeRectShape(this.tiles[i].area);
    
        }
        graphics.closePath();
    }   

    getTileByPosition(x : number, y : number) : Tile | undefined
    {
        var column : number = Math.floor(x / Block.BLOCK_WIDTH);
        var line : number = Math.floor(y / Block.BLOCK_HEIGHT);
        
        return this.getTileByLineColumn(line, column);
    }

    getTileByLineColumn(line : number, column : number) : Tile
    {
        return this.tiles[column + line * GameStage.COLUMNS];
    }

    getBottomNeighborTile(tile : Tile) : Tile | undefined
    {
        return this.getTileByLineColumn(tile.line + 1, tile.column);
    }

    getRightNeighborTile(tile : Tile) : Tile | undefined
    {
        return this.getTileByLineColumn(tile.line, tile.column + 1);
    }

    getLeftNeighborTile(tile : Tile) : Tile | undefined
    {
        return this.getTileByLineColumn(tile.line, tile.column - 1);
    }

    hasFullLine() : boolean
    {
        var lines = GameStage.LINES;
        var columns = GameStage.COLUMNS;
        for (var i = lines; i--;)
        {
            if (i != this.currentFullLineIndex)
            {
                var fullLine : boolean = true;
                var tiles : Array<Tile> = [];
                for (var j = 0; j < columns; j++)
                {
                    var tile : Tile = this.getTileByLineColumn(i, j);
                    if (tile.isBusy())
                    {
                        tiles.push(tile);

                    } else
                    {
                        fullLine = false;
                    }   
                }
                if (fullLine)
                {
                    this.currentFullLineIndex = i;
                    this.currentFullLine = tiles;
                    return true;
                }
            }
        }
        
        return false;
    }

    getCurrentFullLine() : Array<Tile>
    {
        return this.currentFullLine;
    }

    unblockLine(line : number)
    {
        this.currentFullLineIndex = -1;
    }
}