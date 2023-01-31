import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class SelectPlugin extends Plugin {
    canvas: fabric.Canvas | null = null;
    onInit(canvas: fabric.Canvas): void {
        this.onEvent = this.onEvent.bind(this);
        this.onMoving = this.onMoving.bind(this);
        canvas.selection = this.isSelected();
        canvas.on('object:moving', this.onMoving);
    }
    onSelected(newState: boolean): void {
        if (this.canvas === null) throw new Error('Canvas is null');
        if (newState) {
            this.canvas.selection = true;
            this.canvas.on('mouse:up', this.onEvent);
        } else {
            this.canvas.selection = false;
            this.canvas.off('mouse:up', this.onEvent);
        }
    }
    onEvent(e: fabric.IEvent): void {
    }

    onMoving(e: any) {
        this.context?.fabricCommandManager
            .addCommand({
                type: 'move-object',
                data: {
                    id: e.target.name,
                    left: e.target.left ?? 0,
                    top: e.target.top ?? 0,
                }
            },
                false)
    };
}
