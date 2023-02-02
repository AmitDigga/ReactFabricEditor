import { fabric } from 'fabric';
import { SelectedObjectProperty } from './SelectedObjectProperty';


export class WidthProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.width;
    }
    getObjectProperty(obj: fabric.Object, value: number | undefined): fabric.IObjectOptions | null {
        const number = parseInt(value as any);
        if (!isNaN(number)) {
            return { width: number }
        } else {
            return null;
        }
    }
}

export class TopProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.top;
    }
    getObjectProperty(obj: fabric.Object, value: number | undefined): fabric.IObjectOptions | null {
        const number = parseInt(value as any);
        if (!isNaN(number)) {
            return { top: number }
        } else {
            return null;
        }
    }
}

export class LeftProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.left;
    }
    getObjectProperty(obj: fabric.Object, value: number | undefined): fabric.IObjectOptions | null {
        const number = parseInt(value as any);
        if (!isNaN(number)) {
            return { left: number }
        } else {
            return null;
        }
    }
}


export class HeightProperty extends SelectedObjectProperty<number | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.height;
    }
    getObjectProperty(obj: fabric.Object, value: number | undefined): fabric.IObjectOptions | null {
        const number = parseInt(value as any);
        if (!isNaN(number)) {
            return { height: number }
        } else {
            return null;
        }
    }
}

export class SelectableProperty extends SelectedObjectProperty<boolean | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return this.context?.getEditorObjectFromFabricObject(obj)?.fabricObject.selectable;
    }
    getObjectProperty(obj: fabric.Object, value: boolean | undefined): fabric.IObjectOptions | null {
        const editorObject = this.context?.getEditorObjectFromFabricObject(obj);
        if (editorObject) {
            return {
                selectable: !!value
            }
        } else {
            return null;
        }
    }
}

// export class NameProperty extends SelectedObjectProperty<string | undefined> {
//     getValueFromSelectedObject(obj: fabric.Object) {
//         return this.context?.getEditorObjectFromFabricObject(obj)?.name;
//     }
//     setValueToSelectedObject(obj: fabric.Object, value: any) {
//         const editorObject = this.context?.getEditorObjectFromFabricObject(obj);
//         if (editorObject) {
//             editorObject.name = value;
//         }
//     }
// }

export class FillProperty extends SelectedObjectProperty<string | undefined> {
    getValueFromSelectedObject(obj: fabric.Object) {
        return obj.fill?.toString();
    }
    getObjectProperty(obj: fabric.Object, value: string | undefined): fabric.IObjectOptions | null {
        return { fill: value }
    }
}
