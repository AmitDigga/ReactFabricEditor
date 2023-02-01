import { Subject } from "rxjs";
import { FabricContext } from "./FabricContext";
import { IDestroyable } from "./IDestroyable";

export abstract class FabricContextUser implements IDestroyable {
    context?: FabricContext;
    destroy$ = new Subject<void>();
    init(context: FabricContext): void {
        this.context = context;
        this.onInit(context);
    };
    abstract onInit(context: FabricContext): void;
    destroy() {
        this.destroy$.next();
    };
}
