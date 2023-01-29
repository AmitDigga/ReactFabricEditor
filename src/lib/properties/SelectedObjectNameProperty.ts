import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectNameProperty extends SelectedObjectProperty<string | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return this.context?.getEditorObjectFromFabricObject(obj)?.name;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        const editorObject = this.context?.getEditorObjectFromFabricObject(obj);
        if (editorObject) {
            editorObject.name = value;
        }
    }
}
