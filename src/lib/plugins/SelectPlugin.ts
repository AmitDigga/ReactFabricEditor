import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class SelectPlugin extends Plugin<boolean> {
    canvas: fabric.Canvas;

    init(canvas: fabric.Canvas): void {
        this.onEvent = this.onEvent.bind(this);
        this.canvas = canvas;
        this.canvas.selection = this.getState();
    }
    onStateChange(newState: boolean, previousState: boolean): void {
        if (newState) {
            this.canvas.selection = true;
            this.canvas.on('mouse:down', this.onEvent);
        } else {
            this.canvas.selection = false;
            this.canvas.off('mouse:down', this.onEvent);
        }
    }
    onEvent(e: fabric.IEvent): void {
        if (e.e.type === 'mousedown') {
            const target = e.target;
            if (!!target) {
                this.canvas.setActiveObject(target);
            }
        }
    }
}
