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
                this.context.addObject(new fabric.Rect(data));
                break;
            case "create-object":
                const options = data.options;
                switch (data.objectType) {
                    case 'rect':
                        this.context.addObject(new fabric.Rect(options));
                        break;
                    case 'circle':
                        this.context.addObject(new fabric.Circle(options));
                        break;
                    default:
                        throw new Error("Object type not found");
                }
                break;
            case "remove-object":
                this.context.removeObjectById(data.id);
                break;
            case "move-object":
                this.context.moveObjectById(data.id, data.left, data.top);
                break;
            case "update-object":
                this.context.updateObjectById(data.id, data.options);
                break;
            case "set-parent":
                this.context.setParentById(data.childId, data.parentId);
                break;
            case "undo":
                this.undo();
                break;
            default:
                throw new Error("Command not found");
        }
    }

    reset() {
        this.context.reset();
    }
}
