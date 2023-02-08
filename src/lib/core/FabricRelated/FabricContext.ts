import { fromEvent, Observable, Subject, takeUntil } from 'rxjs';
import { IEvent } from 'fabric/fabric-impl';
import { IAction, IBaseState, ICommandManager, IEditorObject, IFabricContext, IFabricContextUser, IPlugin, IProperty } from './interfaces/interface';
import { IDestroyable } from "./interfaces/IDestroyable";
import { FabricCommandManager } from '../commands';
import { EditorObject } from './EditorObject';
import { AllCommands } from './interfaces/AllCommands';

export class BaseState implements IBaseState {
    editorObjects: IEditorObject[];
    objectMap: Map<fabric.Object, IEditorObject>;
    selectedPluginName: string;
    constructor() {
        this.editorObjects = [];
        this.objectMap = new Map();
        this.selectedPluginName = "";
    }
}

export class FabricContext implements IDestroyable, IFabricContext {
    public canvas?: fabric.Canvas;
    public commandManager: ICommandManager<AllCommands>;
    public plugins: IPlugin[];
    public actions: IAction[];
    public properties: IProperty[];
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

    subscribeToEvents(eventName: string, fabricContextUser: IFabricContextUser): Observable<IEvent<Event>> {
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

    registerPlugin(plugin: IPlugin) {
        if (this.isInit) {
            plugin.init(this);
        }
        this.plugins.push(plugin);
        this.registerFabricContextUser(plugin)
        this.pluginChange$.next();
    }

    registerAction(action: IAction) {
        if (this.isInit) {
            action.init(this);
        }
        this.actions.push(action);
        this.registerFabricContextUser(action)
    }

    registerProperty(property: IProperty) {
        if (this.isInit) {
            property.init(this);
        }
        this.properties.push(property);
        this.registerFabricContextUser(property)
    }

    registerFabricContextUser(fabricContextUser: IFabricContextUser) {
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

    selectPlugin(plugin: IPlugin) {
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

    getEditorObjectFromFabricObject(object: fabric.Object): IEditorObject | null {
        return this.state.objectMap.get(object) || null;
    }

    addObject(object: fabric.Object) {
        if (object.name === undefined) throw new Error("Object name should not be undefined")
        if (this.getEditorObjectById(object.name as string)) {
            throw new Error(`Object with name (${object.name}) already exists`);
        }
        const id = object.name as string;
        this.canvas?.add(object);
        const editorObject = new EditorObject(id, object);
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
        const editorObject = this.getEditorObjectByIdOrThrow(objectId);
        const object = editorObject.fabricObject;
        const { left: objectLeft = 0, top: objectTop = 0 } = object;
        const displacement = {
            dLeft: left - objectLeft,
            dTop: top - objectTop
        }
        object.set({
            left,
            top
        })
        editorObject.moveChildren(displacement);
    }

    updateObjectById<T extends fabric.IObjectOptions>(objectId: string, objectOptions: T) {
        const object = this.getEditorObjectById(objectId)?.fabricObject;
        if (object) {
            object.setOptions(objectOptions)
            // this.canvas?.requestRenderAll();
        }
    }

    getEditorObjectById(id: string): IEditorObject | undefined {
        return this.state.editorObjects.find(o => o.id === id);
    }

    getEditorObjectByIdOrThrow(id: string): IEditorObject {
        const object = this.state.editorObjects.find(o => o.id === id);
        if (!object) {
            throw new Error(`Object with id ${id} not found`);
        }
        return object;
    }

    setParentById(childId: string, parentId?: string) {
        if (childId === parentId) throw new Error("Child and parent cannot be same");
        if (parentId === undefined) {
            const child = this.getEditorObjectByIdOrThrow(childId);
            child.setParent(null);
        } else {
            const parent = this.getEditorObjectByIdOrThrow(parentId);
            const child = this.getEditorObjectByIdOrThrow(childId);
            child.setParent(parent);
        }
    }
    rearrangeIndexInParentById(childId: string, newIndex: number) {
        const child = this.getEditorObjectByIdOrThrow(childId);
        const parent = child.parent;
        parent?.moveChildToDifferentIndex(childId, newIndex);
    }
}
