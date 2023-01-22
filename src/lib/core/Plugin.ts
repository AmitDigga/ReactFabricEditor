import { fabric } from 'fabric';
import { Property } from './Property';

export abstract class Plugin<T extends boolean> {
    canvas: fabric.Canvas | null = null;
    constructor(private name: string, private state: T, public properties: Property<any>[] = []) { }
    public getState() { return this.state };
    public setState(state: T) {
        const previousState = this.state;
        this.state = state;
        this.onStateChange(state, previousState);
    };
    getName(): string {
        return this.name;
    };

    init(canvas: fabric.Canvas): void {
        this.canvas = canvas;
        this.properties.forEach(p => p.init(canvas));
        this.onInit(canvas);
    };

    abstract onInit(canvas: fabric.Canvas): void;
    public abstract onStateChange(newState: T, previousState: T): void;
    abstract onEvent(e: fabric.IEvent): void;
}
