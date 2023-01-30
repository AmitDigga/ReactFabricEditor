import { Plugin } from './Plugin';
import { EditorObject } from './EditorObject';
import { getRandomUid } from "../utilities/getRandomUid";
import { Property } from '.';

export type BaseState = {
    editorObjects: EditorObject[];
    objectMap: Map<fabric.Object, EditorObject>;
    selectedPluginName: string;
}

export class FabricContext<State extends BaseState = BaseState> {
    constructor(
        public state: State,
        public plugins: Plugin[],
        public properties: Property<any>[],

    ) { }


    selectPlugin(plugin: Plugin) {
        const previousPluginName = this.state.selectedPluginName;
        this.plugins.forEach(p => {
            if (p.getName() === previousPluginName) {
                p.onSelected(false);
            }
            if (p.getName() === plugin.getName()) {
                p.onSelected(true);
            }
        });
        this.state.selectedPluginName = plugin.getName();
    }

    updateState(state: State) {
        this.state = state;
    }

    getEditorObjectFromFabricObject(object: fabric.Object): EditorObject | null {
        return this.state.objectMap.get(object) || null;
    }

    addObject(canvas: fabric.Canvas, object: fabric.Object, type: string) {
        const id = getRandomUid();
        object.name = id;
        canvas.add(object);
        const editorObject = new EditorObject(id, id, type, object);
        this.state.editorObjects.push(editorObject);
        this.state.objectMap.set(object, editorObject);
    }
    removeObject(canvas: fabric.Canvas, object: fabric.Object) {
        const { objectMap, editorObjects } = this.state;
        const editorObject = objectMap.get(object);
        if (!editorObject) {
            throw new Error("Object not found");
        }
        if (editorObject.parent) {
            editorObject.setParent(null);
        }
        if (editorObject.children.length > 0) {
            editorObject.children.forEach(c => this.removeObject(canvas, c.fabricObject));
        }
        objectMap.delete(object);
        editorObjects.splice(editorObjects.indexOf(editorObject), 1);
        canvas.remove(object);
    }

    getEditorObjectById(id: string) {
        return this.state.editorObjects.find(o => o.id === id);
    }

    setParentById(childId: string, parentId: string) {
        const { editorObjects } = this.state;
        const parent = editorObjects.find(o => o.id === parentId);
        const child = editorObjects.find(o => o.id === childId);
        if (!parent) {
            throw new Error("Parent object not found");
        }
        if (!child) {
            throw new Error("Child object not found");
        }
        child.setParent(parent);
    }
}
