import { FabricContext, Plugin, Property } from "..";
import { Persistance } from "./Persistance";


export class FabricPersistance extends Persistance<FabricContext> {
    constructor(
        private plugins: Plugin[],
        private properties: Property<any>[],
        private canvas: fabric.Canvas
    ) { super(); }
    save(canvas: FabricContext): string {
        return JSON.stringify(canvas.fabricCommandManager.commands);
    }
    load(text: string): FabricContext {
        const commands = JSON.parse(text);
        const context = new FabricContext(
            {
                editorObjects: [],
                objectMap: new Map(),
                selectedPluginName: "Select",
            },
            this.plugins,
            this.properties
        );
        context.init(this.canvas);
        context.fabricCommandManager.addCommands(commands);
        return context;
    }
}
