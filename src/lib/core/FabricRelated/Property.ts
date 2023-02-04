import { Subject } from 'rxjs';
import { FabricContextUser } from "./FabricContextUser";
import { IFabricContext, IProperty, PropertyScope } from './interfaces/interface';

export abstract class Property<T = any> extends FabricContextUser implements IProperty {
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

    onInit(context: IFabricContext): void { }

    abstract getValue(): T;
    abstract setValueInternal(value: T, previousValue: T): void;

}
