import { FabricContext } from ".";
import { fabric } from 'fabric';

export type Command = {
    readonly type: unknown,
    readonly data: unknown,
}

export abstract class MementoCommandManager<T extends Command> {
    public commands: T[];
    constructor() {
        this.commands = [];
    }

    addCommand(command: T, execute: boolean = true) {
        this.commands.push(command);
        if (execute) {
            this.executeCommand(command);
        }
    }

    abstract reset(): void;
    abstract executeCommand(command: T): void;

    executeCommands(commands: T[]) {
        commands.forEach(c => this.executeCommand(c));
    }
    addCommands(commands: T[]) {
        commands.forEach(c => this.addCommand(c));
    }

    undo() {
        const newCommands = this.commands.slice(0, this.commands.length - 1);
        this.commands = [];
        this.reset();
        this.addCommands(newCommands);
    }


    canUndo() {
        return this.commands.length > 0;
    }

}

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

export type AllCommands =
    CreateObjectCommand |
    RemoveObjectCommand |
    MoveObjectCommand |
    SetParentCommand;

export class FabricCommandManager extends MementoCommandManager<AllCommands> {
    constructor(
        public context: FabricContext,
    ) {
        super();
    }


    executeCommand(command: AllCommands) {
        const { type, data } = command;
        switch (type) {
            case "create-rectangle":
                this.context.addObject(new fabric.Rect(data), "");
                break;
            case "remove-object":
                this.context.removeObjectById(data.id);
                break;
            case "move-object":
                this.context.moveObjectTo(data.id, data.left, data.top);
                break;
            case "set-parent":
                this.context.setParentById(data.childId, data.parentId);
                break;
            default:
                throw new Error("Command not found");
        }
    }

    reset() {
        this.context.reset();
    }
}