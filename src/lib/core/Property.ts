import { fabric } from 'fabric';
import { Subject } from 'rxjs';
import { BaseState, FabricContext } from '../../components/Editor';


export abstract class Property<T> {
    change$: Subject<any> = new Subject<any>();
    public canvas: fabric.Canvas | undefined = undefined;
    public context: FabricContext<BaseState> | undefined = undefined;
    constructor(
        public readonly name: string,
        public readonly type: string
    ) { }
    init(canvas: fabric.Canvas, context: FabricContext<any>): void {
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

    onInit(canvas: fabric.Canvas, context: FabricContext<any>): void { }

    abstract getValue(): T;
    abstract setValueInternal(value: T, previousValue: T): void;

}
