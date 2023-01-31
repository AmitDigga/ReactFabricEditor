import { fabric } from 'fabric';
import { Subject } from 'rxjs';
import { FabricContext } from "./FabricContext";
import { Plugin } from './Plugin';


export type PropertyScope = Plugin | 'global';

export abstract class Property<T> {
    change$: Subject<any> = new Subject<any>();
    public context?: FabricContext;
    constructor(
        public readonly name: string,
        public readonly type: string,
        public readonly scope: PropertyScope,
    ) { }
    init(context: FabricContext): void {
        this.context = context;
        this.onInit(context);
    };

    setValue(value: T) {
        const previousValue = this.getValue();
        if (previousValue === value) {
            return;
        }
        this.setValueInternal(value, previousValue);
        this.change$.next(value);
    }

    onInit(context: FabricContext): void { }

    abstract getValue(): T;
    abstract setValueInternal(value: T, previousValue: T): void;

}
