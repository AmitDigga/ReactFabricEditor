import { IAction } from "./interfaces/interface";
import { FabricContextUser } from "./FabricContextUser";

export abstract class Action extends FabricContextUser implements IAction {
    constructor(private name: string) {
        super();
    }
    getName(): string {
        return this.name;
    };
    abstract execute(): void;
}
