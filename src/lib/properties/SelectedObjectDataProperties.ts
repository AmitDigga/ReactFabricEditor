import { EditorObjectDataSetKeyCommand, EditorObjectDataClearCommand, EditorObjectDataSetDataCommand, EditorObject } from '../core';
import { SelectedObjectDataProperty } from './SelectedObjectDataProperty';

export class NameProperty extends SelectedObjectDataProperty<string | undefined> {
    getValueFromSelectedObject(editorObject: EditorObject): string | undefined {
        const name = editorObject.data.getKey('name');
        if (name == undefined || typeof name === 'string') {
            return name;
        } else {
            throw new Error("Wrong type for name");
        }
    }
    getCommand(editorObject: EditorObject, value: string | undefined): EditorObjectDataSetKeyCommand | EditorObjectDataClearCommand | EditorObjectDataSetDataCommand | null {
        if (value == undefined) {
            return null;
        } else {
            return {
                type: "editor-object-data-set-key",
                data: {
                    objectId: editorObject.id,
                    key: "name",
                    value: value
                }
            }
        }
    }
}

