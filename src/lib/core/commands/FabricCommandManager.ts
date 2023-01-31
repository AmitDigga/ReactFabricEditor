import { FabricContext } from "..";
import { fabric } from 'fabric';
import { MementoCommandManager } from "./MementoCommandManager";
import { AllCommands } from "./AllCommands";


export class FabricCommandManager extends MementoCommandManager<AllCommands> {
    constructor(
        public context: FabricContext
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
