import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class CreateRectanglePlugin extends Plugin<boolean> {

    private canvas: fabric.Canvas;
    private rect: fabric.Rect;

    init(canvas: fabric.Canvas) {
        this.onEvent = this.onEvent.bind(this);
        this.canvas = canvas;
    }

    public onStateChange(newState: boolean, _previousState: boolean): void {
        if (newState) {
            this.rect = new fabric.Rect({
                left: 100,
                top: 100,
                fill: 'red',
                width: 20,
                height: 20
            });
            this.canvas.add(this.rect);
            this.canvas.on('mouse:move', this.onEvent);
        } else {
            this.canvas.off('mouse:move', this.onEvent);
            if (this.rect) {
                this.canvas.remove(this.rect);
            }
        }
    }

    onEvent(event: fabric.IEvent) {
        this.rect.set('left', event.pointer.x);
        this.rect.set('top', event.pointer.y);
        this.canvas.renderAll();
    }

    getName(): string {
        return 'CreateRectanglePlugin';
    }
}
