import { fabric } from 'fabric';
import { CreateObjectTypes, FabricContext, Plugin } from '../core';

export class CreateObjectPlugin<T extends fabric.Object, O extends fabric.IObjectOptions> extends Plugin {

    private object: T | null = null;
    private origin: fabric.Point | null = null;


    constructor(
        name: string,
        private objectType: CreateObjectTypes,
        private createGuideObject: () => T,
        private updateGuide: (option: { startX: number, startY: number, pointerX: number, pointerY: number }) => O,
    ) {
        super(name);
    }


    onInit(context: FabricContext): void {
        this.subscribeToEvents('mouse:down').subscribe(this.onMouseDown)
        this.subscribeToEvents('mouse:move').subscribe(this.onMouseMove)
        this.select$.subscribe((selected) => {
            if (selected) {
                this.createAndAddObject();
            } else {
                if (this.object) {
                    this.context?.canvas?.remove(this.object);
                }
            }
        })
    }

    createAndAddObject() {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        this.object = this.createGuideObject();
        canvas.add(this.object);
    }

    onMouseDown = (event: fabric.IEvent) => {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (this.object === null) throw new Error('Rect is null');
        if (!event.pointer) { return; }

        if (!this.origin) {
            this.origin = new fabric.Point(event.pointer.x, event.pointer.y);
        } else {
            this.context?.commandManager
                .addCommand({
                    type: 'create-object',
                    data: {
                        objectType: this.objectType,
                        options: {
                            ...this.object.toObject(),
                            name: this.object.name,
                        }
                    },
                })
            canvas?.remove(this.object);
            this.createAndAddObject();
            this.origin = null;
        }
    }
    onMouseMove = (event: fabric.IEvent) => {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (this.object === null) throw new Error('Rect is null');
        if (!event.pointer) { return; }

        if (!!this.origin) {
            this.object.setOptions(this.updateGuide({
                startX: this.origin.x,
                startY: this.origin.y,
                pointerX: event.pointer.x,
                pointerY: event.pointer.y,
            }));
        } else {
            this.object.set('left', event.pointer.x);
            this.object.set('top', event.pointer.y);
        }
        canvas.requestRenderAll();
    }

}
