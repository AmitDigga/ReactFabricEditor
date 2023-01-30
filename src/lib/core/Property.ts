import { fabric } from 'fabric';
import { Subject } from 'rxjs';
import { FabricContext } from "../../components/FabricContext";
import { Plugin } from './Plugin';


export type PropertyScope = Plugin | 'global';

export abstract class Property<T> {
    change$: Subject<any> = new Subject<any>();
    public canvas: fabric.Canvas | undefined = undefined;
    public context: FabricContext | undefined = undefined;
    constructor(
        public readonly name: string,
        public readonly type: string,
        public readonly scope: PropertyScope,
    ) { }
    init(canvas: fabric.Canvas, context: FabricContext): void {
        this.canvas = canvas;
        this.context = context;
        this.onInit(canvas, context);
    };

    setValue(value: T) {
        const previousValue = this.getValue();
        if (previousValue === value) {
            return;
        }
        this.setValueInternal(value, previousValue);
        this.change$.next(value);
    }

    onInit(canvas: fabric.Canvas, context: FabricContext): void { }

    abstract getValue(): T;
    abstract setValueInternal(value: T, previousValue: T): void;

}
