import { SerializableObject } from "../FabricRelated/EditorObjectData";
import { Command } from "./Command";

export type CreateRectangleCommand = Command & {
    readonly type: "create-rectangle",
    readonly data: fabric.IRectOptions,
}
export type CreateObjectTypes = 'rect' | 'circle';
export type CreateObjectCommand = Command & {
    readonly type: "create-object",
    readonly data: {
        readonly objectType: CreateObjectTypes,
        readonly options: fabric.IObjectOptions,

    },
}

export type RemoveObjectCommand = Command & {
    readonly type: "remove-object",
    readonly data: { id: string },
}

export type MoveObjectCommand = Command & {
    readonly type: "move-object",
    readonly data: { id: string, top: number, left: number },
}

export type UpdateObjectCommand = Command & {
    readonly type: "update-object",
    readonly data: { id: string, options: fabric.IObjectOptions },
}

export type SetParentCommand = Command & {
    readonly type: "set-parent",
    readonly data: { childId: string, parentId: string },
}

export type UndoCommand = Command & {
    readonly type: "undo",
    readonly data: void,
}

export type EditorObjectDataSetKeyCommand = Command & {
    readonly type: "editor-object-data-set-key",
    readonly data: {
        objectId: string,
        key: string,
        value: SerializableObject
    },
}
export type EditorObjectDataClearCommand = Command & {
    readonly type: "editor-object-data-clear",
    readonly data: {
        objectId: string,
    },
}
export type EditorObjectDataSetDataCommand = Command & {
    readonly type: "editor-object-data-set-data",
    readonly data: {
        objectId: string,
        data: Record<string, SerializableObject>
    },
}



export type AllCommands =
    CreateRectangleCommand |
    CreateObjectCommand |
    RemoveObjectCommand |
    MoveObjectCommand |
    UpdateObjectCommand |
    SetParentCommand |
    UndoCommand |
    EditorObjectDataSetKeyCommand |
    EditorObjectDataClearCommand |
    EditorObjectDataSetDataCommand;
