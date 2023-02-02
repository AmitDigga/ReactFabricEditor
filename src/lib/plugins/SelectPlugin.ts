import { IEvent } from 'fabric/fabric-impl';
import { FabricContext, Plugin } from '../core';

export class SelectPlugin extends Plugin {
    onInit(context: FabricContext): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        this.subscribeToEvents('mouse:up').subscribe(this.onMouseUp);
        this.select$.subscribe((selected) => { canvas.selection = selected; })
        canvas.selection = this.isSelected();
    }

    onMouseUp = (e: IEvent) => {
        if (!e.target) return;
        this.context?.commandManager
            .addCommand({
                type: 'move-object',
                data: {
                    id: e.target.name ?? '',
                    left: e.target.left ?? 0,
                    top: e.target.top ?? 0,
                },
            },
                { execute: false })
    };
}
