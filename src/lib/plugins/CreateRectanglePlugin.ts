import { fabric } from 'fabric';
import { FabricContext, Plugin } from '../core';
import { getRandomUid } from '../utilities/getRandomUid';

export class CreateRectanglePlugin extends Plugin {



    private rect: fabric.Rect | null = null;
    private origin: fabric.Point | null = null;

    onInit(context: FabricContext): void {
        this.onEvent = this.onEvent.bind(this);
    }

    public onSelected(selected: boolean): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (selected) {
            this.createAndAddRect();
            canvas.on('mouse:move', this.onEvent);
            canvas.on('mouse:down', this.onEvent);
        } else {
            canvas.off('mouse:move', this.onEvent);
            canvas.off('mouse:down', this.onEvent);
            if (this.rect) {
                canvas.remove(this.rect);
            }
        }
    }

    createAndAddRect() {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
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
        canvas.add(this.rect);
    }

    onEvent(event: fabric.IEvent) {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
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
                            name: getRandomUid(),
                        }
                    })
                canvas?.remove(this.rect);
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
        canvas.renderAll();
    }

    destroy(): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        canvas.off('mouse:move', this.onEvent);
        canvas.off('mouse:down', this.onEvent);
    }

}
