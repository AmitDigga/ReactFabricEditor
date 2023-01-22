import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class CreateRectanglePlugin extends Plugin<boolean> {


    private rect: fabric.Rect | null = null;
    private origin: fabric.Point | null = null;

    onInit(canvas: fabric.Canvas): void {
        this.onEvent = this.onEvent.bind(this);
    }

    public onStateChange(newState: boolean, _previousState: boolean): void {
        if (this.canvas === null) throw new Error('Canvas is null');
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
        if (this.canvas === null) throw new Error('Canvas is null');
        this.rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 20,
            height: 20,
            selectable: true,
        });
        this.canvas.add(this.rect);
    }

    onEvent(event: fabric.IEvent) {
        if (this.canvas === null) throw new Error('Canvas is null');
        if (this.rect === null) throw new Error('Rect is null');
        if (!event.pointer) {
            return;
        }
        if (event.e.type === "mousedown") {
            if (!!this.origin) {
                this.createAndAddRect();
                this.origin = null;
            } else {
                this.origin = new fabric.Point(event.pointer.x, event.pointer.y);
            }
        } else {
            if (!!this.origin) {
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
