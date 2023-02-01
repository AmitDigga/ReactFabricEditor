import { Subject } from 'rxjs';
import { FabricContext } from "./FabricContext";
import { FabricContextUser } from './FabricContextUser';
import { Plugin } from './Plugin';


export type PropertyScope = Plugin | 'global';

export abstract class Property<T = any> extends FabricContextUser {
    change$: Subject<any> = new Subject<any>();
    constructor(
        public readonly name: string,
        public readonly type: string,
        public readonly scope: PropertyScope,
    ) {
        super()
    }
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
