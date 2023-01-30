import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectWidthPositionProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.width;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        if (!isNaN(value)) {
            obj.set('width', parseInt(value));
        }
    }
}
