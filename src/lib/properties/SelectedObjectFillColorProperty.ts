import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectFillColorProperty extends SelectedObjectProperty {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.fill;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        obj.set('fill', value);
    }
}
