import { Property, PropertyScope, FabricContext, EditorObjectDataSetKeyCommand, EditorObjectDataSetDataCommand, EditorObjectDataClearCommand, EditorObject } from '../core';


export abstract class SelectedObjectDataProperty<T> extends Property<T> {
    constructor(name: string, type: string, scope: PropertyScope, private defaultValue: any) {
        super(name, type, scope);
    }
    onInit(context: FabricContext): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        canvas.on('selection:created', this.onChange);
        canvas.on('selection:updated', this.onChange);
        canvas.on('selection:cleared', this.onChange);
    }
    onChange = () => {
        this.change$.next(this.getValue())
    }
    destroy(): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        canvas.off('selection:created', this.onChange);
        canvas.off('selection:updated', this.onChange);
        canvas.off('selection:cleared', this.onChange);
    }
    abstract getValueFromSelectedObject(editorObject: EditorObject): T;
    abstract getCommand(editorObject: EditorObject, value: T): EditorObjectDataSetKeyCommand | EditorObjectDataSetDataCommand | EditorObjectDataClearCommand | null;
    getValue(): T {
        const canvas = this.context?.canvas;
        const selectedObject = canvas?.getActiveObject();
        if (this.context && selectedObject && selectedObject.name) {
            const editorObject = this.context?.getEditorObjectByIdOrThrow(selectedObject.name);
            const data = editorObject.data;
            return this.getValueFromSelectedObject(editorObject);
        } else {
            return this.defaultValue;
        }
    }
    setValueInternal(value: T): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        const selectedObject = canvas.getActiveObject();
        if (this.context && selectedObject && selectedObject.name) {
            const editorObject = this.context.getEditorObjectByIdOrThrow(selectedObject.name);
            const command = this.getCommand(editorObject, value);
            if (command === null) return;
            this.context?.commandManager.addCommand(command)
            // canvas.requestRenderAll();
        }
    }
}
