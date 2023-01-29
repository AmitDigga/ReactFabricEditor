import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class SelectedObjectFillColorProperty extends SelectedObjectProperty<string | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.fill?.toString();
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        obj.set('fill', value);
    }
}
