import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectLeftPositionProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.left;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        if (!isNaN(value)) {
            obj.set('left', parseInt(value));
        }
    }
}
