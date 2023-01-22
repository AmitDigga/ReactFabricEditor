import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectLeftPositionProperty extends SelectedObjectProperty {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.left;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        if (!isNaN(value)) {
            obj.set('left', parseInt(value));
        }
    }
}
