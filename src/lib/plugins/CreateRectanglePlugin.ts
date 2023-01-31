import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class CreateRectanglePlugin extends Plugin {


    private rect: fabric.Rect | null = null;
    private origin: fabric.Point | null = null;

    onInit(canvas: fabric.Canvas): void {
        this.onEvent = this.onEvent.bind(this);
    }

    public onSelected(selected: boolean): void {
        if (this.canvas === null) throw new Error('Canvas is null');
        if (selected) {
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
            fill: '#00000000',
            stroke: '#0000000',
            strokeWidth: 1,
            width: 20,
            height: 20,
            selectable: true,
            strokeUniform: true,
        });
        this.canvas.add(this.rect);
    }

    onEvent(event: fabric.IEvent) {
        if (this.canvas === null) throw new Error('Canvas is null');
        if (this.rect === null) throw new Error('Rect is null');
        if (!event.pointer) { return; }

        if (event.e.type === "mousedown") {
            if (!this.origin) {
                this.origin = new fabric.Point(event.pointer.x, event.pointer.y);
            } else {
                this.context?.fabricCommandManager
                    .addCommand({
                        type: 'create-rectangle',
                        data: {
                            ...this.rect.toObject(),
                        }
                    })
                this.canvas?.remove(this.rect);
                this.createAndAddRect();
                this.origin = null;
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
