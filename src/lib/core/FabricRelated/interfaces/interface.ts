import { EventName, IEvent } from "fabric/fabric-impl";
import { Observable, Subject } from "rxjs";
import { AllCommands } from "./AllCommands";
import { IDestroyable } from "./IDestroyable";

export type SerializableObject = string |
    number |
    boolean |
    SerializableObject[] |
{ [key: string]: SerializableObject };

export interface IEditorObjectData {
    setKey(key: string, value: SerializableObject): void;
    clearData(): void;
    setData(data: Record<string, SerializableObject>): void;
    getKey<T extends SerializableObject>(key: string, defaultValue?: T): T | undefined;
}

export interface IEditorObject extends IDestroyable {
    id: string;
    parent: IEditorObject | null;
    children: IEditorObject[];
    fabricObject: fabric.Object;
    // tempPositionData: TransformData;
    data: IEditorObjectData;
    destroy(): void;
    removeChild(id: string): void;
    addChild(child: IEditorObject): void;
    setParent(parentEditorObject: IEditorObject | null): void;
    onMouseDown: (e: any) => void;
    onMove: (e: any) => void;
    moveChildren(displacement: {
        dLeft: number;
        dTop: number;
    }): void;
}

export interface IBaseState {
    editorObjects: IEditorObject[];
    objectMap: Map<fabric.Object, IEditorObject>;
    selectedPluginName: string;
}

export interface IFabricContextUser extends IDestroyable {
    context?: IFabricContext;
    destroy$: Subject<void>;
    init(context: IFabricContext): void;
    onInit(context: IFabricContext): void;
    destroy(): void;
}


export type Command = {
    readonly type: unknown,
    readonly data: unknown,
}

export type CommandOption = {
    execute: boolean;
    triggerOnChange: boolean;
    store: boolean;
}

export interface ICommandManager<T extends Command> {
    commands: T[];
    onChange$: Subject<void>;
    addCommand(command: T, options?: Partial<CommandOption>): void;
    reset(): void;
    executeCommand(command: T): void;
    executeCommands(commands: T[]): void;
    addCommands(commands: T[], options?: Partial<CommandOption>): void;
    undo(): void;
    setCommands(commands: T[], options?: Partial<CommandOption>): void;
    canUndo(): boolean;
}

export interface IAction extends IFabricContextUser {
    getName(): string;
    execute(): void;
}

export interface IPlugin extends IFabricContextUser {
    select$: Subject<boolean>;
    getName(): string;
    isSelected(): boolean;
    subscribeToEvents(eventName: EventName): Observable<IEvent>;
    setSelected(selected: boolean): void;
    destroy(): void;
}

export type PropertyScope = IPlugin | 'global';

export interface IProperty<T = any> extends IFabricContextUser {
    readonly name: string;
    readonly type: string;
    readonly scope: PropertyScope;
    change$: Subject<any>;
    setValue(value: T): void;
    onInit(context: IFabricContext): void;
    getValue(): T;
    setValueInternal(value: T, previousValue: T): void;
}

export interface IFabricContext extends IDestroyable {
    canvas?: fabric.Canvas;
    commandManager: ICommandManager<AllCommands>;
    plugins: IPlugin[];
    actions: IAction[];
    properties: IProperty[];
    state: IBaseState;
    pluginChange$: Subject<void>;
    subscribeToEvents(eventName: string, fabricContextUser: IFabricContextUser): Observable<IEvent<Event>>;
    isInit: boolean;
    init(canvas: fabric.Canvas): void;
    registerPlugin(plugin: IPlugin): void;
    registerAction(action: IAction): void;
    registerProperty(property: IProperty): void;
    registerFabricContextUser(fabricContextUser: IFabricContextUser): void;
    destroy(): void;
    reset(): void;
    selectPlugin(plugin: IPlugin): void;
    getEditorObjectFromFabricObject(object: fabric.Object): IEditorObject | null;
    addObject(object: fabric.Object): void;
    removeObjectById(objectId: string): void;
    moveObjectById(objectId: string, left: number, top: number): void;
    updateObjectById<T extends fabric.IObjectOptions>(objectId: string, objectOptions: T): void;
    getEditorObjectById(id: string): IEditorObject | undefined;
    getEditorObjectByIdOrThrow(id: string): IEditorObject;
    setParentById(childId: string, parentId: string): void;
}