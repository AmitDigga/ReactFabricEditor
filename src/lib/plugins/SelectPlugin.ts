import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { FabricContext, Plugin } from '../core';

export class SelectPlugin extends Plugin {
    onInit(context: FabricContext): void {
        this.onEvent = this.onEvent.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        canvas.selection = this.isSelected();
        canvas.on('mouse:up', this.onMouseUp);
    }
    destroy(): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        canvas.off('mouse:up', this.onMouseUp);
        canvas.off('mouse:up', this.onEvent);
    }
    onSelected(selected: boolean): void {
        const canvas = this.context?.canvas;
        if (!canvas) return;
        if (selected) {
            canvas.selection = true;
            canvas.on('mouse:up', this.onEvent);
        } else {
            canvas.selection = false;
            canvas.off('mouse:up', this.onEvent);
        }
    }
    onEvent(e: fabric.IEvent): void {
    }

    onMouseUp(e: IEvent) {
        if (!e.target) return;
        this.context?.fabricCommandManager
            .addCommand({
                type: 'move-object',
                data: {
                    id: e.target.name ?? '',
                    left: e.target.left ?? 0,
                    top: e.target.top ?? 0,
                }
            },
                false)
    };
}
