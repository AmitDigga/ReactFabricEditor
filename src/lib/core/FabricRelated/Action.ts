import { FabricContextUser } from './FabricContextUser';

export abstract class Action extends FabricContextUser {
    constructor(private name: string) {
        super();
    }
    getName(): string {
        return this.name;
    };
    abstract execute(): void;
}
