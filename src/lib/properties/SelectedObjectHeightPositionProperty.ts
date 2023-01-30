import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectHeightPositionProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.height;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        if (!isNaN(value)) {
            obj.set('height', parseInt(value));
        }
    }
}
