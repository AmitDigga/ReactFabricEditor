import { fabric } from 'fabric';
import { Property } from '../core/Property';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class EveryObjectProperty extends Property<fabric.Object[]> {
    init(canvas: fabric.Canvas): void {
        super.init(canvas);
        canvas.on('object:added', () => this.change$.next(this.getValue()));
        canvas.on('object:removed', () => this.change$.next(this.getValue()));
    }
    getValue() {
        return this.canvas?.getObjects() || [];
    }
    setValueInternal(value: fabric.Object[], previousValue: fabric.Object[]) {
        this.canvas?.clear();
        this.canvas?.add(...value);
    }
}
