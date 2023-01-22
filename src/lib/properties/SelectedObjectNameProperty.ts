import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectNameProperty extends SelectedObjectProperty<string | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.name;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        obj.set('name', value);
    }
}
