import { Action, FabricContext } from "../core";

export class UndoAction extends Action {
    constructor(name: string) {
        super(name);
    }
    onInit(context: FabricContext): void { }
    execute() {
        this.context?.commandManager.addCommand(
            {
                type: 'undo',
                data: void 0,
            },
            { store: false }
        )
    }
}