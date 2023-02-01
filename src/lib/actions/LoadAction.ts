import { Action, FabricCommandPersistance, FabricContext } from "../core";

export class LoadAction extends Action {
    constructor(name: string, private load: () => string | null) {
        super(name);
    }
    onInit(context: FabricContext): void { }
    execute() {
        if (!this.context) throw new Error("Context is not initialized");
        const string = this.load();
        if (string === null) return;
        const commands = new FabricCommandPersistance().load(string);
        this.context.commandManager.setCommands(commands);
    }
}