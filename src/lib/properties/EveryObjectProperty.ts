import { EditorObject, FabricContext } from '../core';
import { Property } from '../core/Property';


export class EveryObjectProperty extends Property<EditorObject[]> {
    onInit(context: FabricContext) {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
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
