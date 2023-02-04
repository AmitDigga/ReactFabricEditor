import { EditorObjectDataSetKeyCommand, EditorObjectDataClearCommand, EditorObjectDataSetDataCommand } from '../core/FabricRelated/interfaces/AllCommands';
import { IEditorObject } from '../core/FabricRelated/interfaces/interface';
import { SelectedObjectDataProperty } from './SelectedObjectDataProperty';

export class NameProperty extends SelectedObjectDataProperty<string | undefined> {
    getValueFromSelectedObject(editorObject: IEditorObject): string | undefined {
        const name = editorObject.data.getKey('name');
        if (name == undefined || typeof name === 'string') {
            return name;
        } else {
            throw new Error("Wrong type for name");
        }
    }
    getCommand(editorObject: IEditorObject, value: string | undefined): EditorObjectDataSetKeyCommand | EditorObjectDataClearCommand | EditorObjectDataSetDataCommand | null {
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

