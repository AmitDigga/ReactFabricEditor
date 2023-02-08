import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { FabricContext, Plugin } from '../core';

export class SelectPlugin extends Plugin {
    onInit(context: FabricContext): void {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        this.subscribeToEvents('mouse:up').subscribe(this.onMouseUp);
        this.subscribeToEvents('mouse:down').subscribe(this.onMouseDown);
        this.select$.subscribe((selected) => {
            canvas.selection = selected;
            if (this.context?.canvas?.getActiveObject()) {
                this.context?.canvas?.discardActiveObject()
            }
            this.context?.state.editorObjects
                .forEach((e) => {
                    if (e) {
                        e.fabricObject.set('selectable', selected);
                    }
                })
        })
        canvas.selection = this.isSelected();
    }

    targetPositionOnMouseDown: { left: number | undefined, top: number | undefined } = { left: 0, top: 0 };

    onMouseDown = (e: IEvent) => {
        if (!e.target) return;
        this.targetPositionOnMouseDown = { left: e.target.left, top: e.target.top };
    }

    onMouseUp = (e: IEvent) => {
        if (!e.target) return;
        const target = e.target;
        const scaleX = target.scaleX ?? 1;
        const scaleY = target.scaleY ?? 1;
        const moveX = (target.left ?? 0) - (this.targetPositionOnMouseDown.left ?? 0);
        const moveY = (target.top ?? 0) - (this.targetPositionOnMouseDown.top ?? 0);
        if (Math.abs(moveX) > .001 || Math.abs(moveY) > .001) {
            this.context?.commandManager
                .addCommand(
                    {
                        type: 'move-object',
                        data: {
                            id: target.name ?? '',
                            left: target.left ?? 0,
                            top: target.top ?? 0,
                        },
                    },
                    { execute: false })
        }

        if (scaleX === 1 && scaleY === 1) {
            return;
        } else {
            console.log("Update")
            if (target.type === 'rect') {
                const newWidth = (target.width ?? 0) * scaleX;
                const newHeight = (target.height ?? 0) * scaleY;
                target.set('width', newWidth);
                target.set('height', newHeight);
                target.set('scaleX', 1);
                target.set('scaleY', 1);
                this.context?.commandManager
                    .addCommand(
                        {
                            type: 'update-object',
                            data: {
                                id: target.name ?? '',
                                options: {
                                    width: newWidth,
                                    height: newHeight,
                                    scaleX: 1,
                                    scaleY: 1,
                                }
                            },
                        },
                        { execute: false })
            } else if (target.type === 'circle') {
                if (!(target instanceof fabric.Circle)) {
                    throw new Error("Circle is not circle")
                }
                const newRadius = ((e.target as fabric.ICircleOptions).radius ?? 0) * (scaleX + scaleY) / 2;
                target.set('radius', newRadius);
                target.set('scaleX', 1);
                target.set('scaleY', 1);
                this.context?.commandManager
                    .addCommand(
                        {
                            type: 'update-object',
                            data: {
                                id: target.name ?? '',
                                options: {
                                    radius: newRadius,
                                    scaleX: 1,
                                    scaleY: 1,
                                } as fabric.IObjectOptions
                            },
                        },
                        { execute: false })
            }
        }


    };
}
