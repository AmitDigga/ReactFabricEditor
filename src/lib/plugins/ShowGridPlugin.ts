import { Canvas } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import { ExposedPropertyType, Plugin } from '../core/Plugin';

export class ShowGridPlugin extends Plugin<boolean> {
    canvas: Canvas | null = null;
    init(canvas: Canvas): void {
        this.canvas = canvas;
        this.createGrid();
    }

    private createGrid() {
        if (this.canvas === null) throw new Error('Canvas is null');
        const canvas = this.canvas;
        const visible = this.getState();
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

    public onStateChange(newState: boolean, _previousState: boolean): void {
        const showGrid = newState;
        const canvas = this.canvas;
        if (!canvas)
            return;
        canvas.forEachObject((o) => {
            if (o.name === "gridLine") {
                o.visible = showGrid;
            }
        });
        canvas.requestRenderAll();

    }
    onEvent(event: fabric.IEvent): void {
    }

    getExposedProperty(): ExposedPropertyType[] {
        return [];
    }
}
