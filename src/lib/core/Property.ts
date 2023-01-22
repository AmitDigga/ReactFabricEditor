import { fabric } from 'fabric';
import { Subject } from 'rxjs';


export abstract class Property<T> {
    change$: Subject<any> = new Subject<any>();
    canvas: fabric.Canvas | undefined = undefined;
    constructor(
        public readonly name: string,
        public readonly type: string
    ) { }
    init(canvas: fabric.Canvas): void {
        this.canvas = canvas;
    };
    setValue(value: T) {
        const previousValue = this.getValue();
        if (previousValue === value) {
            return;
        }
        this.setValueInternal(value, previousValue);
        this.change$.next(value);
    }

    abstract getValue(): T;
    abstract setValueInternal(value: T, previousValue: T): void;

}
