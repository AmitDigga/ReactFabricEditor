import { Action, FabricCommandPersistance, FabricContext } from "../core";

export class SaveAction extends Action {
    constructor(name: string, private save: (data: string) => void) {
        super(name);
    }
    onInit(context: FabricContext): void { }
    execute() {
        if (!this.context) throw new Error("Context is not initialized");
        this.save(new FabricCommandPersistance().save(this.context.commandManager.commands))
    }
}