import { Command } from "./Command";

export type CreateObjectCommand = Command & {
    readonly type: "create-rectangle",
    readonly data: fabric.IRectOptions,
}

export type RemoveObjectCommand = Command & {
    readonly type: "remove-object",
    readonly data: { id: string },
}

export type MoveObjectCommand = Command & {
    readonly type: "move-object",
    readonly data: { id: string, top: number, left: number },
}

export type SetParentCommand = Command & {
    readonly type: "set-parent",
    readonly data: { childId: string, parentId: string },
}

export type UndoCommand = Command & {
    readonly type: "undo",
    readonly data: void,
}



export type AllCommands =
    CreateObjectCommand |
    RemoveObjectCommand |
    MoveObjectCommand |
    SetParentCommand |
    UndoCommand;
