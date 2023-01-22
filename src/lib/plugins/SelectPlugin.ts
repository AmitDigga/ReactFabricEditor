import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class SelectPlugin extends Plugin<boolean> {
    canvas: fabric.Canvas | null = null;
    onInit(canvas: fabric.Canvas): void {
        this.onEvent = this.onEvent.bind(this);
        this.onEvent = this.onEvent.bind(this);
        canvas.selection = this.getState();
    }
    onStateChange(newState: boolean, previousState: boolean): void {
        if (this.canvas === null) throw new Error('Canvas is null');
        if (newState) {
            this.canvas.selection = true;
            this.canvas.on('mouse:up', this.onEvent);
        } else {
            this.canvas.selection = false;
            this.canvas.off('mouse:up', this.onEvent);
        }
    }
    onEvent(e: fabric.IEvent): void {
    }
}
