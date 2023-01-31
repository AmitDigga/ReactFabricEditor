import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class WidthProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.width;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        if (!isNaN(value)) {
            obj.set('width', parseInt(value));
        }
    }
}

export class TopProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.top;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        if (!isNaN(value)) {
            obj.set('top', parseInt(value));
        }
    }
}

export class LeftProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.left;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        if (!isNaN(value)) {
            obj.set('left', parseInt(value));
        }
    }
}


export class HeightProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.height;
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        if (!isNaN(value)) {
            obj.set('height', parseInt(value));
        }
    }
}

export class SelectableProperty extends SelectedObjectProperty<boolean | undefined> {
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

export class NameProperty extends SelectedObjectProperty<string | undefined> {
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

export class FillProperty extends SelectedObjectProperty<string | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.fill?.toString();
    }
    setValueToSelectedObject(obj: fabric.Object, value: any) {
        obj.set('fill', value);
    }
}
