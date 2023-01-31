import { fabric } from 'fabric';
import { FabricContextUser } from './FabricContextUser';

export abstract class Plugin extends FabricContextUser {
    private selected: boolean = false;
    constructor(private name: string, private state: boolean) {
        super();
    }
    getName(): string {
        return this.name;
    };

    isSelected(): boolean {
        return this.selected;
    }

    setSelected(selected: boolean): void {
        this.selected = selected;
        this.onSelected(selected);
    }

    onSelected(selected: boolean): void {

    }
    abstract onEvent(e: fabric.IEvent): void;

}
