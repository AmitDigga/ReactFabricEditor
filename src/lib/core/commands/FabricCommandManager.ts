import { FabricContext } from "..";
import { fabric } from 'fabric';
import { MementoCommandManager } from "./MementoCommandManager";
import { AllCommands, CreateObjectCommand } from "./AllCommands";


export class FabricCommandManager extends MementoCommandManager<AllCommands> {
    constructor(
        public context: FabricContext
    ) {
        super();
    }

    private getFabricObjectFromOptions(command: CreateObjectCommand): fabric.Object {
        const { data } = command;
        switch (data.objectType) {
            case 'rect':
                return new fabric.Rect(data.options);
            case 'circle':
                return new fabric.Circle(data.options);
            case 'triangle':
                return new fabric.Triangle(data.options);
            case 'polygon':
                return new fabric.Polygon(data.points, data.options);
            case 'path':
                if (typeof data.path === 'string') {
                    return new fabric.Path(data.path, data.options);
                } else {
                    const points = data.path.map(p => new fabric.Point(p.x, p.y));
                    return new fabric.Path(points, data.options);
                }
            case 'text':
                return new fabric.Text(data.text, data.options);
            case 'image':
                return new fabric.Image(data.objectType, data.options);
            case 'group':
                const objects = data.objectsId.map(id => this.context.getEditorObjectByIdOrThrow(id).fabricObject);
                return new fabric.Group(objects, data.options);
            default:
                throw new Error("Object type not found");
        }
    }

    executeCommand(command: AllCommands) {
        const { type, data } = command;
        switch (type) {
            case "create-rectangle":
                this.context.addObject(new fabric.Rect(data));
                break;
            case "create-object":
                this.context.addObject(this.getFabricObjectFromOptions(command));
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
            case "editor-object-data-set-data":
                this.context
                    .getEditorObjectByIdOrThrow(data.objectId)
                    .data
                    .setData(data.data);
                break;
            case "editor-object-data-set-key":
                this.context
                    .getEditorObjectByIdOrThrow(data.objectId)
                    .data
                    .setKey(data.key, data.value);
                break;
            case "editor-object-data-clear":
                this.context
                    .getEditorObjectByIdOrThrow(data.objectId)
                    .data
                    .clearData();
                break;
            default:
                throw new Error("Command not found");
        }
    }

    reset() {
        this.context.reset();
    }
}
