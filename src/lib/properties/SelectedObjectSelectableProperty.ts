import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectSelectableProperty extends SelectedObjectProperty<boolean | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return this.context?.getEditorObjectFromFabricObject(obj)?.fabricObject.selectable;
    }
    setValueToSelectedObject(obj: fabric.Object, value: boolean | undefined) {
        const editorObject = this.context?.getEditorObjectFromFabricObject(obj);
        if (editorObject) {
            editorObject.fabricObject.selectable = value;
        }
    }
}
