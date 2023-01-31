import { fabric } from 'fabric';
import { FabricContext } from '../core';
import { Plugin } from '../core/Plugin';


export class XYLocationPlugin extends Plugin {

    private text: fabric.Text | null = null;

    onInit(context: FabricContext): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        this.onEvent = this.onEvent.bind(this);
        this.text = new fabric.Text('0,0', {
            left: 10,
            top: 10,
            fontSize: 8,
            fill: 'black',
            visible: this.isSelected(),
        });
        canvas.add(this.text);
    }

    public onSelected(newState: boolean): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (this.text === null) throw new Error('Text is null');
        if (newState) {
            this.text.visible = true;
            canvas.on('mouse:move', this.onEvent);
        } else {
            canvas.off('mouse:move', this.onEvent);
            this.text.visible = false;
            canvas.requestRenderAll();
        }
    }

    onEvent(event: any) {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (this.text === null) throw new Error('Text is null');
        this.text.set('text', `${Math.floor(event.pointer.x)},${Math.floor(event.pointer.y)}`);
        canvas.renderAll();
    }

}
