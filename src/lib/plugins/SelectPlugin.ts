import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class SelectPlugin extends Plugin {
    canvas: fabric.Canvas | null = null;
    // objects: fabric.Object[] = [];
    onInit(canvas: fabric.Canvas): void {
        this.onEvent = this.onEvent.bind(this);
        canvas.selection = this.isSelected();
        // canvas.on('object:added', (e) => {
        //     if (e.target) {
        //         this.objects.push(e.target);
        //     }
        // });
        // canvas.on('object:removed', (e) => {
        //     if (e.target) {
        //         const index = this.objects.indexOf(e.target);
        //         if (index > -1) {
        //             this.objects.splice(index, 1);
        //         }
        //     }
        // });
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
}
