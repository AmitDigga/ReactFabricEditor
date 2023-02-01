import { Subject } from "rxjs";
import { Command } from "./Command";


export type CommandOption = {
    execute: boolean;
    triggerOnChange: boolean;
    store: boolean;
}

export abstract class MementoCommandManager<T extends Command> {
    public commands: T[];
    public onChange$ = new Subject<void>();
    constructor() {
        this.commands = [];
    }

    addCommand(command: T, options: Partial<CommandOption> = {}) {
        if (options.store ?? true) {
            this.commands.push(command);
        }
        if (options.execute ?? true) {
            this.executeCommand(command);
        }
        if (options.triggerOnChange ?? true)
            this.onChange$.next();
    }

    abstract reset(): void;
    abstract executeCommand(command: T): void;

    executeCommands(commands: T[]) {
        commands.forEach(c => this.executeCommand(c));
    }
    addCommands(commands: T[], options: Partial<CommandOption> = {}) {
        commands.forEach(c => this.addCommand(c, {
            ...options,
            triggerOnChange: false
        }));
        if (options.triggerOnChange ?? true)
            this.onChange$.next();
    }

    undo() {
        const newCommands = this.commands.slice(0, this.commands.length - 1);
        this.setCommands(newCommands);
    }

    setCommands(commands: T[], options: Partial<CommandOption> = {}) {
        this.commands = [];
        this.reset();
        this.addCommands(commands, options);
    }


    canUndo() {
        return this.commands.length > 0;
    }

}
