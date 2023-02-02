import { fabric } from 'fabric';
import { FabricContext, Plugin } from '../core';
import { getRandomUid } from '../utilities/getRandomUid';

export class CreateRectanglePlugin extends Plugin {

    private rect: fabric.Rect | null = null;
    private origin: fabric.Point | null = null;

    onInit(context: FabricContext): void {
        this.subscribeToEvents('mouse:down').subscribe(this.onMouseDown)
        this.subscribeToEvents('mouse:move').subscribe(this.onMouseMove)
        this.select$.subscribe((selected) => {
            if (selected) {
                this.createAndAddRect();
            } else {
                if (this.rect) {
                    this.context?.canvas?.remove(this.rect);
                }
            }
        })
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

    onMouseDown = (event: fabric.IEvent) => {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (this.rect === null) throw new Error('Rect is null');
        if (!event.pointer) { return; }

        if (!this.origin) {
            this.origin = new fabric.Point(event.pointer.x, event.pointer.y);
        } else {
            this.context?.commandManager
                .addCommand({
                    type: 'create-rectangle',
                    data: {
                        ...this.rect.toObject(),
                        name: getRandomUid(),
                    },
                })
            canvas?.remove(this.rect);
            this.createAndAddRect();
            this.origin = null;
        }
    }
    onMouseMove = (event: fabric.IEvent) => {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (this.rect === null) throw new Error('Rect is null');
        if (!event.pointer) { return; }

        if (!!this.origin) {
            this.rect.set('width', event.pointer.x - this.origin.x);
            this.rect.set('height', event.pointer.y - this.origin.y);
        } else {
            this.rect.set('left', event.pointer.x);
            this.rect.set('top', event.pointer.y);
        }
        canvas.requestRenderAll();
    }

}
