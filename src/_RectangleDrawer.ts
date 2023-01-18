// // @ts-check
// import { fabric } from 'fabric';
// import { v4 as uuid } from 'uuid';

// export class RectangleDrawer {
//     canvas: fabric.Canvas;
//     className: string;
//     isDrawing: boolean;
//     origX: number;
//     origY: number;
//     onModified: ((obj: fabric.Object) => void) | null = null;
//     onCreated: ((obj: fabric.Object) => void) | null = null;
//     constructor(canvas: fabric.Canvas) {
//         this.canvas = canvas;
//         this.className = 'Rectangle';
//         this.isDrawing = false;
//         canvas.on("object:modified", (e) => {
//             if (this.onModified) {
//                 this.onModified(e.target);
//             }
//         })
//         this.canvas.on('mouse:down', (o) => {
//             if (o.transform != null) {
//                 return;
//             }
//             this.onMouseDown(o);
//         });
//         this.canvas.on('mouse:move', (o) => {
//             this.onMouseMove(o);
//         });
//         this.canvas.on('mouse:up', (o) => {
//             this.onMouseUp(o);
//         });
//         this.canvas.on('object:moving', (o) => {
//             this.disable();
//         })
//     }


//     onMouseUp(o) {
//         if (this.isDrawing && this.onCreated) {
//             this.onCreated(this.canvas.getActiveObject());
//         }
//         this.disable();
//     }

//     onMouseMove(o) {
//         if (!this.isEnable()) { return; }

//         var pointer = this.canvas.getPointer(o.e);
//         var activeObj = this.canvas.getActiveObject();

//         activeObj.stroke = 'red',
//             activeObj.strokeWidth = 1;
//         activeObj.fill = 'transparent';

//         if (this.origX > pointer.x) {
//             activeObj.set({ left: Math.abs(pointer.x) });
//         }
//         if (this.origY > pointer.y) {
//             activeObj.set({ top: Math.abs(pointer.y) });
//         }

//         activeObj.set({ width: Math.abs(this.origX - pointer.x) });
//         activeObj.set({ height: Math.abs(this.origY - pointer.y) });

//         activeObj.setCoords();
//         this.canvas.renderAll();

//     }

//     onMouseDown(o) {
//         this.enable();
//         var pointer = this.canvas.getPointer(o.e);
//         let origX = pointer.x;
//         let origY = pointer.y;
//         this.origX = origX;
//         this.origY = origY;

//         var rect = new fabric.Rect({
//             name: uuid(),
//             left: origX,
//             top: origY,
//             originX: 'left',
//             originY: 'top',
//             width: pointer.x - origX,
//             height: pointer.y - origY,
//             angle: 0,
//             transparentCorners: false,
//             hasBorders: false,
//             hasControls: true,

//         });

//         // rect.my = {
//         //     type: 'rectangle'
//         // }
//         rect.setControlsVisibility({
//             tl: false,
//             tr: false,
//             bl: false,
//             br: false,
//             mtr: false
//         })


//         this.canvas.add(rect)
//         this.canvas.setActiveObject(rect);

//     };

//     isEnable() {
//         return this.isDrawing;
//     }

//     enable() {
//         this.isDrawing = true;
//     }

//     disable() {
//         this.isDrawing = false;
//     }

// }
