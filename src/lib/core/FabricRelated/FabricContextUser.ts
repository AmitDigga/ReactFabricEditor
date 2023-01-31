import { FabricContext } from "./FabricContext";
import { IDestroyable } from "./IDestroyable";

export abstract class FabricContextUser implements IDestroyable {
    context?: FabricContext<any>;
    init(context: FabricContext): void {
        this.context = context;
        this.onInit(context);
    };
    abstract onInit(context: FabricContext): void;
    abstract destroy(): void;
}
