import { fabric } from 'fabric';
import { Action, FabricContext } from '../core';

export class ShowGridAction extends Action {
    gridCreated = false;
    gridVisible = false;

    execute(): void {
        this.gridVisible = !this.gridVisible;
        this.updateGridVisibility();
    }

    onInit(context: FabricContext): void { }
    destroy(): void { }

    private createGrid() {
        console.log(true)
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is not defined');
        this.gridCreated = true;
        const visible = this.gridVisible;
        const lightProperties = { stroke: '#00888844', selectable: false, name: 'gridLine', visible };
        const darkerProperties = { stroke: '#00888888', selectable: false, name: 'gridLine', visible };
        const canvasWidth = canvas.width ?? 600;
        const canvasHeight = canvas.height ?? 600;
        const lines = 20;
        const darkerLineGap = 5;
        for (let hLines = 0; hLines < lines; hLines++) {
            const y = canvasHeight * hLines / lines;
            const isDarker = hLines % darkerLineGap == 0;
            const line = new fabric.Line([0, y, canvasWidth, y], isDarker ? darkerProperties : lightProperties);
            canvas.add(line);
        }
        for (let vLines = 0; vLines < lines; vLines++) {
            const x = canvasWidth * vLines / lines;
            const isDarker = vLines % darkerLineGap == 0;
            const line = new fabric.Line([x, 0, x, canvasHeight], isDarker ? darkerProperties : lightProperties);
            canvas.add(line);
        }
    }

    public updateGridVisibility(): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is not defined');
        if (this.gridCreated === false) { this.createGrid(); }
        canvas.forEachObject((o) => {
            if (o.name === "gridLine") {
                o.visible = this.gridVisible;
            }
        });
        canvas.requestRenderAll();

    }

}
