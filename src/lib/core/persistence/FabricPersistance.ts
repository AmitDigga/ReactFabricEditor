import { AllCommands } from "..";
import { Persistance } from "./Persistance";


export class FabricCommandPersistance extends Persistance<AllCommands[]> {
    constructor() { super(); }
    save(commands: AllCommands[]): string {
        return JSON.stringify(commands);
    }
    load(text: string): AllCommands[] {
        const commands = JSON.parse(text);
        return commands;
    }
}
