import Phaser, { GameObjects } from 'phaser';
import Block from './Block';

export default class Tile
{
    private scene : Phaser.Scene;
    public area : Phaser.Geom.Rectangle;
    private busy : boolean = false;

    private block : Block | undefined;
    public line : number;
    public column : number;
    private depth : number;

    constructor(scene : Phaser.Scene, area : Phaser.Geom.Rectangle, line : number, column : number, depth : number)
    {
        this.scene = scene;
        this.area = area;
        this.line = line;
        this.column = column;
        this.depth = depth;
    }

    setBlock(block : Block | undefined) 
    {
        this.block = block;
    }

    getBlock() : Block | undefined
    {
        return this.block;
    }

    isBusy() : boolean
    {
        return this.busy;
    }

    setBusy(busy : boolean)
    {
        this.busy = busy;
        /*if (this.isBusy())
        {
            this.highlight();
        } else
        {
            this.highlight2();
        }*/
    }

    clear(block : Block)
    {
        if (this.block == block)
        {
            this.setBusy(false);
            this.setBlock(undefined);
        }
    }

    getDepth() : number
    {
        return this.depth;
    }

    highlight()
    {
        var graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x0000FF);
        graphics.fillStyle(0x0000FF, 1);
        graphics.fillRectShape(this.area);
        graphics.strokeRectShape(this.area);
        graphics.closePath();
        graphics.alpha = 1;
    
    }
    highlight2()
    {
        var graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0xFF0000);
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillRectShape(this.area);
        graphics.strokeRectShape(this.area);
        graphics.closePath();
        graphics.alpha = 1;
    }
}
