import { Subject } from "rxjs";
import { IFabricContext, IFabricContextUser } from "./interfaces/interface";
import { IDestroyable } from "./interfaces/IDestroyable";

export abstract class FabricContextUser implements IDestroyable, IFabricContextUser {
    context?: IFabricContext;
    destroy$ = new Subject<void>();
    init(context: IFabricContext): void {
        this.context = context;
        this.onInit(context);
    };
    abstract onInit(context: IFabricContext): void;
    destroy() {
        this.destroy$.next();
    };
}
