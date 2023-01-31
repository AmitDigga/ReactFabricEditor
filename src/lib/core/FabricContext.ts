import { IDestroyable, Property } from '.';
import { EditorObject } from './EditorObject';
import { Plugin, FabricCommandManager } from '.';

export type BaseState = {
    editorObjects: EditorObject[];
    objectMap: Map<fabric.Object, EditorObject>;
    selectedPluginName: string;
}

export class FabricContext<State extends BaseState = BaseState> implements IDestroyable {
    canvas?: fabric.Canvas;
    fabricCommandManager: FabricCommandManager;
    constructor(
        public state: State,
        public plugins: Plugin[],
        public properties: Property<any>[],
    ) {
        this.fabricCommandManager = new FabricCommandManager(this);
    }

    init(canvas: fabric.Canvas) {
        this.canvas = canvas;
        this.plugins.forEach(p => p.init(this));
        this.properties.forEach(p => p.init(this));
    }

    destroy(): void {
        this.state.editorObjects.forEach(o => o.destroy());
        this.plugins.forEach(p => p.destroy());
        this.properties.forEach(p => p.destroy());
    }

    reset() {
        this.canvas?.clear();
        this.state.editorObjects.forEach(o => o.destroy());
        this.state.editorObjects = [];
        this.state.objectMap = new Map();
    }


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

    addObject(object: fabric.Object, type: string) {
        if (this.getEditorObjectById(object.name as string)) {
            throw new Error(`Object with name (${object.name}) already exists`);
        }
        const id = object.name as string;
        this.canvas?.add(object);
        const editorObject = new EditorObject(id, id, type, object);
        this.state.editorObjects.push(editorObject);
        this.state.objectMap.set(object, editorObject);
    }
    removeObject(object: fabric.Object) {
        const { objectMap, editorObjects } = this.state;
        const editorObject = objectMap.get(object);
        if (!editorObject) {
            throw new Error("Object not found");
        }
        if (editorObject.parent) {
            editorObject.setParent(null);
        }
        if (editorObject.children.length > 0) {
            editorObject.children.forEach(c => this.removeObject(c.fabricObject));
        }
        objectMap.delete(object);
        editorObjects.splice(editorObjects.indexOf(editorObject), 1);
        editorObject.destroy();
        this.canvas?.remove(object);
    }

    removeObjectById(objectId: string) {
        const object = this.getEditorObjectById(objectId)?.fabricObject;
        if (object) {
            this.removeObject(object);
        }
    }
    moveObjectTo(objectId: string, left: number, top: number) {
        const object = this.getEditorObjectById(objectId)?.fabricObject;
        if (object) {
            object.set({
                left,
                top
            })
            this.canvas?.requestRenderAll();
        }
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
