import { Command } from "./Command";


export abstract class MementoCommandManager<T extends Command> {
    public commands: T[];
    constructor() {
        this.commands = [];
    }

    addCommand(command: T, execute: boolean = true) {
        this.commands.push(command);
        if (execute) {
            this.executeCommand(command);
        }
    }

    abstract reset(): void;
    abstract executeCommand(command: T): void;

    executeCommands(commands: T[]) {
        commands.forEach(c => this.executeCommand(c));
    }
    addCommands(commands: T[]) {
        commands.forEach(c => this.addCommand(c));
    }

    undo() {
        const newCommands = this.commands.slice(0, this.commands.length - 1);
        this.commands = [];
        this.reset();
        this.addCommands(newCommands);
    }


    canUndo() {
        return this.commands.length > 0;
    }

}
