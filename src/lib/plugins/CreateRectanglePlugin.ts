import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class CreateRectanglePlugin extends Plugin<boolean> {

    private canvas: fabric.Canvas;
    private rect: fabric.Rect;
    private origin: fabric.Point;

    init(canvas: fabric.Canvas) {
        this.onEvent = this.onEvent.bind(this);
        this.canvas = canvas;
    }

    public onStateChange(newState: boolean, _previousState: boolean): void {
        if (newState) {
            this.createAndAddRect();
            this.canvas.on('mouse:move', this.onEvent);
            this.canvas.on('mouse:down', this.onEvent);
        } else {
            this.canvas.off('mouse:move', this.onEvent);
            this.canvas.off('mouse:down', this.onEvent);
            if (this.rect) {
                this.canvas.remove(this.rect);
            }
        }
    }

    createAndAddRect() {
        this.rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 20,
            height: 20,
        });
        this.canvas.add(this.rect);
    }

    onEvent(event: fabric.IEvent) {
        const isMouseDown = event.e.type === 'mousedown';
        const isMouseUp = event.e.type === 'mouseup';
        const isOriginSet = !!this.origin;
        if (isMouseDown) {
            if (isOriginSet) {
                this.createAndAddRect();
                this.origin = null;
            } else {
                this.origin = new fabric.Point(event.pointer.x, event.pointer.y);
            }
        } else {
            if (isOriginSet) {
                this.rect.set('width', event.pointer.x - this.origin.x);
                this.rect.set('height', event.pointer.y - this.origin.y);
            } else {
                this.rect.set('left', event.pointer.x);
                this.rect.set('top', event.pointer.y);
            }
        }
        this.canvas.renderAll();
    }
}
