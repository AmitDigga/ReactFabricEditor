import { fabric } from 'fabric';
import { FabricContext } from "./FabricContext";

export abstract class Plugin {
    context?: FabricContext<any>;
    private selected: boolean = false;
    constructor(private name: string, private state: boolean) { }
    getName(): string {
        return this.name;
    };

    isSelected(): boolean {
        return this.selected;
    }

    setSelected(selected: boolean): void {
        this.selected = selected;
        this.onSelected(selected);
    }

    onSelected(selected: boolean): void {

    }

    init(context: FabricContext): void {
        this.context = context;
        this.onInit(context);
    };

    abstract onInit(context: FabricContext): void;
    // public abstract onStateChange(newState: boolean, previousState: boolean): void;
    abstract onEvent(e: fabric.IEvent): void;
}
