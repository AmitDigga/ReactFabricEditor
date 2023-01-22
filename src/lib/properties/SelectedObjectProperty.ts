import { fabric } from 'fabric';
import { Property } from '../core/Property';


export abstract class SelectedObjectProperty extends Property {
    constructor(name: string, type: string, private defaultValue: any) {
        super(name, type);
    }
    init(canvas: fabric.Canvas): void {
        super.init(canvas);
        canvas.on('selection:created', () => {
            this.change$.next(this.getValue());
        });
        canvas.on('selection:updated', () => {
            this.change$.next(this.getValue());
        });
        canvas.on('selection:cleared', () => {
            this.change$.next(this.getValue());
        });
    }
    abstract getValueFromSelectedObject(obj: fabric.Object): any;
    abstract setValueToSelectedObject(obj: fabric.Object, value: any): any;
    getValue(): any {
        const selectedObject = this.canvas?.getActiveObject();
        if (selectedObject) {
            return this.getValueFromSelectedObject(selectedObject);
        } else {
            return this.defaultValue;
        }
    }
    setValueInternal(value: any): void {
        const selectedObject = this.canvas?.getActiveObject();
        if (selectedObject) {
            this.setValueToSelectedObject(selectedObject, value);
            this.canvas?.requestRenderAll();
        }
    }
}
