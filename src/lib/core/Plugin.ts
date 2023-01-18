import { fabric } from 'fabric';

export abstract class Plugin {
    abstract init(canvas: fabric.Canvas): void;
    abstract onMenuItemSelected(event: any): void;
    abstract onMenuItemUnselected(event: any): void;
    abstract onEvent(event: any): void;
    abstract getName(): string;
    abstract getMenuItemName(): string;
}
