import { EventName, IEvent } from 'fabric/fabric-impl';
import { filter, Observable, Subject } from 'rxjs';
import { FabricContextUser } from './FabricContextUser';

export abstract class Plugin extends FabricContextUser {
    private selected: boolean = false;
    public select$ = new Subject<boolean>();
    constructor(private name: string) {
        super();
    }
    getName(): string {
        return this.name;
    };

    isSelected(): boolean {
        return this.selected;
    }

    subscribeToEvents(eventName: EventName): Observable<IEvent> {
        if (this.context === undefined) throw new Error('Context is undefined');
        return this.context
            .subscribeToEvents(eventName, this)
            .pipe(filter(() => this.isSelected()))
            ;
    }

    setSelected(selected: boolean): void {
        this.selected = selected;
        this.select$.next(selected);
    }


    destroy(): void {
        super.destroy();
        this.select$.complete();
    }

}
