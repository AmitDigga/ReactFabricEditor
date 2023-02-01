import { fromEvent, Observable, pipe, Subject, takeUntil } from 'rxjs';
import { FabricContextUser, IDestroyable, Property } from '..';
import { EditorObject } from './EditorObject';
import { Plugin, FabricCommandManager } from '..';
import { IEvent } from 'fabric/fabric-impl';
import { Action } from './Action';

export class BaseState {
    editorObjects: EditorObject[];
    objectMap: Map<fabric.Object, EditorObject>;
    selectedPluginName: string;
    constructor() {
        this.editorObjects = [];
        this.objectMap = new Map();
        this.selectedPluginName = "";
    }
}

export class FabricContext implements IDestroyable {
    public canvas?: fabric.Canvas;
    public commandManager: FabricCommandManager;
    public plugins: Plugin[];
    public actions: Action[];
    public properties: Property[];
    public state: BaseState;
    private destroyable: IDestroyable[];
    public pluginChange$ = new Subject<void>();
    constructor() {
        this.state = new BaseState();
        this.commandManager = new FabricCommandManager(this);
        this.plugins = [];
        this.actions = [];
        this.properties = [];
        this.destroyable = [];
    }

    subscribeToEvents(eventName: string, fabricContextUser: FabricContextUser): Observable<IEvent<Event>> {
        if (!this.canvas) {
            throw new Error("Canvas is not initialized");
        }
        return fromEvent(this.canvas, eventName).pipe(
            takeUntil(fabricContextUser.destroy$)
        )
    }

    isInit = false;
    init(canvas: fabric.Canvas) {
        if (this.isInit) throw new Error("FabricContext is already initialized");
        this.isInit = true;
        this.canvas = canvas;
        this.plugins.forEach(p => p.init(this));
        this.properties.forEach(p => p.init(this));
        this.actions.forEach(a => a.init(this));
    }

    registerPlugin(plugin: Plugin) {
        if (this.isInit) {
            plugin.init(this);
        }
        this.plugins.push(plugin);
        this.registerFabricContextUser(plugin)
        this.pluginChange$.next();
    }

    registerAction(action: Action) {
        if (this.isInit) {
            action.init(this);
        }
        this.actions.push(action);
        this.registerFabricContextUser(action)
    }

    registerProperty(property: Property) {
        if (this.isInit) {
            property.init(this);
        }
        this.properties.push(property);
        this.registerFabricContextUser(property)
    }

    registerFabricContextUser(fabricContextUser: FabricContextUser) {
        this.destroyable.push(fabricContextUser);
    }


    destroy(): void {
        this.destroyable.forEach(d => d.destroy());
        this.canvas?.clear();
        this.state.editorObjects = [];
        this.state.objectMap = new Map();
    }
    reset(): void {
        this.canvas?.clear();
        this.state.editorObjects.forEach(eo => eo.destroy());
        this.state.editorObjects = [];
        this.state.objectMap = new Map();
    }

    selectPlugin(plugin: Plugin) {
        const previousPluginName = this.state.selectedPluginName;
        this.plugins.forEach(p => {
            if (p.getName() === previousPluginName) {
                p.setSelected(false);
            }
            if (p.getName() === plugin.getName()) {
                p.setSelected(true);
            }
        });
        this.state.selectedPluginName = plugin.getName();
        this.pluginChange$.next();

    }

    getEditorObjectFromFabricObject(object: fabric.Object): EditorObject | null {
        return this.state.objectMap.get(object) || null;
    }

    addObject(object: fabric.Object) {
        if (this.getEditorObjectById(object.name as string)) {
            throw new Error(`Object with name (${object.name}) already exists`);
        }
        const id = object.name as string;
        this.canvas?.add(object);
        const editorObject = new EditorObject(id, id, object);
        this.destroyable.push(editorObject);
        this.state.editorObjects.push(editorObject);
        this.state.objectMap.set(object, editorObject);
    }

    private removeObject(object: fabric.Object) {
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
        this.destroyable.splice(this.destroyable.indexOf(editorObject), 1);
        this.canvas?.remove(object);
    }

    removeObjectById(objectId: string) {
        const object = this.getEditorObjectById(objectId)?.fabricObject;
        if (object) {
            this.removeObject(object);
        }
    }

    moveObjectById(objectId: string, left: number, top: number) {
        const object = this.getEditorObjectById(objectId)?.fabricObject;
        if (object) {
            object.set({
                left,
                top
            })
            this.canvas?.requestRenderAll();
        }
    }

    getEditorObjectById(id: string): EditorObject | undefined {
        return this.state.editorObjects.find(o => o.id === id);
    }

    getEditorObjectByIdOrThrow(id: string): EditorObject {
        const object = this.state.editorObjects.find(o => o.id === id);
        if (!object) {
            throw new Error(`Object with id ${id} not found`);
        }
        return object;
    }

    setParentById(childId: string, parentId: string) {
        const parent = this.getEditorObjectByIdOrThrow(parentId);
        const child = this.getEditorObjectByIdOrThrow(childId);
        child.setParent(parent);
    }
}
