import { fabric } from 'fabric';
import { ExposedPropertyType, Plugin } from '../core/Plugin';

export class SelectPlugin extends Plugin<boolean> {
    canvas: fabric.Canvas;
    selectedObject: fabric.Object;

    init(canvas: fabric.Canvas): void {
        this.onEvent = this.onEvent.bind(this);
        this.canvas = canvas;
        this.canvas.selection = this.getState();
    }
    onStateChange(newState: boolean, previousState: boolean): void {
        if (newState) {
            this.canvas.selection = true;
            this.canvas.on('mouse:up', this.onEvent);
        } else {
            this.canvas.selection = false;
            this.canvas.off('mouse:up', this.onEvent);
        }
    }
    onEvent(e: fabric.IEvent): void {
        if (e.e.type === 'mouseup') {
            const target = this.canvas.getActiveObject();
            if (!!target) {
                this.selectedObject = target;
                this.getExposedProperty().forEach((property: ExposedPropertyType) => {
                    this.notifyPropertyChange(property);
                });
            }
        }
    }
    getExposedProperty(): ExposedPropertyType[] {
        var main = this;
        if (this.selectedObject) {
            return [
                {
                    name: 'x',
                    type: 'number',
                    getValue: () => this.selectedObject.left,
                    setValue: function (value: unknown) {
                        main.selectedObject.set('left', parseInt(value as string));
                        main.notifyPropertyChange(this);
                        main.canvas.renderAll();
                    }
                }
            ]
        }
        return [];
    }
}
