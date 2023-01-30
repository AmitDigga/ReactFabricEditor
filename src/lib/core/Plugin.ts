import { fabric } from 'fabric';
import { FabricContext } from '../../components/Editor';
import { Property } from './Property';

export abstract class Plugin {
    canvas: fabric.Canvas | null = null;
    context: FabricContext<any> | null = null;
    private selected: boolean = false;
    constructor(private name: string, private state: boolean, public properties: Property<any>[] = []) { }
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

    init(canvas: fabric.Canvas, context: FabricContext<any>): void {
        this.canvas = canvas;
        this.context = context;
        this.properties.forEach(p => p.init(canvas, context));
        this.onInit(canvas);
    };

    abstract onInit(canvas: fabric.Canvas): void;
    // public abstract onStateChange(newState: boolean, previousState: boolean): void;
    abstract onEvent(e: fabric.IEvent): void;
}
