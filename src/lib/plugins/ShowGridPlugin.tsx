import { Canvas } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import { Plugin } from '../core/Plugin';

export class ShowGridPlugin extends Plugin {
    canvas: Canvas;
    gridsCreated: boolean;
    init(canvas: Canvas): void {
        this.canvas = canvas;
        this.gridsCreated = false;
    }
    onMenuItemSelected(event: any): void {
        const canvas = this.canvas;
        if (!canvas)
            return;
        if (!this.gridsCreated) {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const lines = 20;
            const darkerLineGap = 5;
            for (let hLines = 0; hLines < lines; hLines++) {
                const y = canvasHeight * hLines / lines;
                const isDarker = hLines % darkerLineGap == 0;
                const color = isDarker ? '#00888888' : '#00888844';
                const line = new fabric.Line([0, y, canvasWidth, y], { stroke: color, selectable: false, name: 'gridLine', visible: true });
                canvas.add(line);
            }
            for (let vLines = 0; vLines < lines; vLines++) {
                const x = canvasWidth * vLines / lines;
                const isDarker = vLines % darkerLineGap == 0;
                const color = isDarker ? '#00888888' : '#00888844';
                const line = new fabric.Line([x, 0, x, canvasHeight], { stroke: color, selectable: false, name: 'gridLine', visible: true });
                canvas.add(line);
            }
        }

        canvas.forEachObject((o) => {
            if (o.name === "gridLine") {
                o.visible = true;
            }
        });

        canvas.requestRenderAll();
    }
    onMenuItemUnselected(event: any): void {
        const canvas = this.canvas;
        if (!canvas)
            return;
        canvas.forEachObject((o) => {
            if (o.name === "gridLine") {
                o.visible = false;
            }
        });
        canvas.requestRenderAll();
    }
    onEvent(event: any): void {
    }
    getName(): string {
        return "Show Grid";
    }
    getMenuItemName(): string {
        return "Grid";
    }
}
