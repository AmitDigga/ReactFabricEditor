import { fabric } from 'fabric';

export type ExposedPropertyType = {
    name: string;
    type: string;
    getValue(): any;
    setValue(value: any): any;
}

export type OnChange<T> = (t: T) => void;

export abstract class Plugin<T extends boolean> {
    onPropertyChange: OnChange<ExposedPropertyType>[] = [];

    notifyPropertyChange(property: ExposedPropertyType) {
        this.onPropertyChange.forEach((onChange: OnChange<ExposedPropertyType>) => onChange(property));
    }
    addPropertyChangeListener(onChange: OnChange<ExposedPropertyType>) {
        this.onPropertyChange.push(onChange);
    }
    removePropertyChangeListener(onChange: OnChange<ExposedPropertyType>) {
        this.onPropertyChange = this.onPropertyChange
            .filter((listener: OnChange<ExposedPropertyType>) => listener !== onChange);
    }
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
    abstract getExposedProperty(): ExposedPropertyType[];
}
