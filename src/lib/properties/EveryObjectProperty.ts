import { fabric } from 'fabric';
import { FabricContext } from "../../components/FabricContext";
import { EditorObject } from "../../components/EditorObject";
import { Property } from '../core/Property';


export class EveryObjectProperty extends Property<EditorObject[]> {
    onInit(canvas: fabric.Canvas, context: FabricContext) {
        canvas.on('object:added', () => this.change$.next(this.getValue()));
        canvas.on('object:removed', () => this.change$.next(this.getValue()));
    }
    getValue() {
        return this.context?.state.editorObjects ?? [];
    }
    setValueInternal(value: EditorObject[], previousValue: EditorObject[]) {
        // this.canvas?.clear();
        // this.canvas?.add(...value);
    }
}
