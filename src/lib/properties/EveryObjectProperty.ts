import { EditorObject, FabricContext, Property } from '../core';


export class EveryObjectProperty extends Property<EditorObject[]> {
    onInit(context: FabricContext) {
        this.onChange = this.onChange.bind(this);
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        canvas.on('object:added', this.onChange);
        canvas.on('object:removed', this.onChange);
    }
    onChange() {
        this.change$.next(this.getValue())
    }
    destroy(): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        canvas.off('object:added', this.onChange);
        canvas.off('object:removed', this.onChange);
    }
    getValue() {
        return this.context?.state.editorObjects ?? [];
    }
    setValueInternal(value: EditorObject[], previousValue: EditorObject[]) {
        // this.canvas?.clear();
        // this.canvas?.add(...value);
    }
}
