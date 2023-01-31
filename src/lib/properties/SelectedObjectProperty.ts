import { fabric } from 'fabric';
import { Property, PropertyScope, FabricContext } from '../core';


export abstract class SelectedObjectProperty<T> extends Property<T> {
    constructor(name: string, type: string, scope: PropertyScope, private defaultValue: any) {
        super(name, type, scope);
    }
    onInit(context: FabricContext<any>): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
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
    abstract getValueFromSelectedObject(obj: fabric.Object): T;
    abstract setValueToSelectedObject(obj: fabric.Object, value: T): any;
    getValue(): T {
        const canvas = this.context?.canvas;
        const selectedObject = canvas?.getActiveObject();
        if (selectedObject) {
            return this.getValueFromSelectedObject(selectedObject);
        } else {
            return this.defaultValue;
        }
    }
    setValueInternal(value: T): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        const selectedObject = canvas.getActiveObject();
        if (selectedObject) {
            this.setValueToSelectedObject(selectedObject, value);
            canvas.requestRenderAll();
        }
    }
}
