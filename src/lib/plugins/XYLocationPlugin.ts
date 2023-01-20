import { fabric } from 'fabric';
import { ExposedPropertyType, Plugin } from '../core/Plugin';


export class XYLocationPlugin extends Plugin<boolean>{

    private canvas: fabric.Canvas;
    private text: fabric.Text;

    init(canvas: fabric.Canvas) {
        this.onEvent = this.onEvent.bind(this);
        this.canvas = canvas;
        this.text = new fabric.Text('0,0', {
            left: 10,
            top: 10,
            fontSize: 8,
            fill: 'black',
            visible: this.getState(),
        });
        this.canvas.add(this.text);
    }

    public onStateChange(newState: boolean, previousState: boolean): void {
        if (newState) {
            this.text.visible = true;
            this.canvas.on('mouse:move', this.onEvent);
        } else {
            this.canvas.off('mouse:move', this.onEvent);
            this.text.visible = false;
            this.canvas.requestRenderAll();
        }
    }

    onEvent(event: any) {
        this.text.set('text', `${Math.floor(event.pointer.x)},${Math.floor(event.pointer.y)}`);
        this.canvas.renderAll();
    }

    getExposedProperty(): ExposedPropertyType[] {
        return [];
    }

}
