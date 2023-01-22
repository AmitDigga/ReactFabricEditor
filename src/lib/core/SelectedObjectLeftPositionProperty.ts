import { fabric } from 'fabric';
import { Property } from './Property';


export class SelectedObjectLeftPositionProperty extends Property {
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
    getValue(): any {
        return this.canvas?.getActiveObject()?.left ?? 0;
    }
    setValueInternal(value: any): void {
        const activeObject = this.canvas?.getActiveObject();
        if (activeObject) {
            activeObject.set('left', parseInt(value as string));
            this.canvas?.renderAll();
        }
    }
}
