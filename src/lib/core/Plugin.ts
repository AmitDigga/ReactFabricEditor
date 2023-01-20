import { fabric } from 'fabric';

export abstract class Plugin<T extends boolean> {
    constructor(private name: string, private state: T) { }
    public getState() { return this.state };
    public setState(state: T) {
        const previousState = this.state;
        this.state = state;
        this.onStateChange(state, previousState);
    };
    getName(): string {
        return this.name;
    };

    abstract init(canvas: fabric.Canvas): void;
    public abstract onStateChange(newState: T, previousState: T): void;
    abstract onEvent(e: fabric.IEvent): void;
}
