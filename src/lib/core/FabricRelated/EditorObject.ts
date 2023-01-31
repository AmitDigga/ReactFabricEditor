import { IDestroyable } from "./IDestroyable";

export class EditorObject implements IDestroyable {
    id: string;
    name: string;
    type: string;
    parent: EditorObject | null;
    children: EditorObject[];
    fabricObject: fabric.Object;
    tempPositionData: TransformData;

    constructor(id: string, name: string, type: string, fabricObject: fabric.Object) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.fabricObject = fabricObject;
        this.parent = null;
        this.children = [];
        this.tempPositionData = getObjectData(fabricObject);
        this.onMove = this.onMove.bind(this);
        this.onScale = this.onScale.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.fabricObject.on('mousedown:before', this.onMouseDown);
        this.fabricObject.on('moving', this.onMove);
        this.fabricObject.on('scaling', this.onScale);
    }

    destroy() {
        this.fabricObject.off('mousedown:before', this.onMouseDown);
        this.fabricObject.off('moving', this.onMove);
        this.fabricObject.off('scaling', this.onScale);
    }

    removeChild(id: string) {
        this.children = this.children.filter(c => c.id !== id);
    }
    addChild(child: EditorObject) {
        this.children.push(child);
    }

    setParent(parentEditorObject: EditorObject | null) {
        if (this.parent) {
            this.parent.removeChild(this.id);
            this.parent = null;
        }
        if (parentEditorObject) {
            this.parent = parentEditorObject;
            this.parent.addChild(this);
        }
    }
    onMouseDown(e: any) {
        this.tempPositionData = getObjectData(this.fabricObject);
    };
    onMove(e: any) {
        const newTransform = getObjectData(this.fabricObject);
        const displacement = {
            dLeft: newTransform.left - this.tempPositionData.left,
            dTop: newTransform.top - this.tempPositionData.top,
        };
        this.tempPositionData = newTransform;
        this.moveChildren(displacement)
    }
    moveChildren(displacement: { dLeft: number, dTop: number }) {
        this.children.forEach(child => {
            child.fabricObject.set({
                left: (child.fabricObject.left ?? 0) + displacement.dLeft,
                top: (child.fabricObject.top ?? 0) + displacement.dTop,
            });
            child.moveChildren(displacement);
        });
    }
    onScale(e: any) {
        // if (!this.parent)
        //     return;
        // const positionDelta = getPositionDelta(this.dataOnClick.parent, this.dataOnClick.child);
        // const newScale = {
        //     scaleXFactor: (this.parent.fabricObject.scaleX ?? 1) / this.dataOnClick.parent.scaleX,
        //     scaleYFactor: (this.parent.fabricObject.scaleY ?? 1) / this.dataOnClick.parent.scaleY,
        // };
        // const newPosition = {
        //     left: this.dataOnClick.parent.left + positionDelta.deltaX * newScale.scaleXFactor,
        //     top: this.dataOnClick.parent.top + positionDelta.deltaY * newScale.scaleYFactor,
        // };
        // const newSize = {
        //     width: this.dataOnClick.child.width * newScale.scaleXFactor,
        //     height: this.dataOnClick.child.height * newScale.scaleYFactor,
        // };
        // this.fabricObject.set({
        //     ...newPosition,
        //     ...newSize,
        // });
    }
}

export type TransformData = {
    width: number;
    height: number;
    left: number;
    top: number;
    scaleX: number;
    scaleY: number;
}
export function getObjectData(object: fabric.Object): TransformData {
    return {
        width: object.width ?? 0,
        height: object.height ?? 0,
        left: object.left ?? 0,
        top: object.top ?? 0,
        scaleX: object.scaleX ?? 1,
        scaleY: object.scaleY ?? 1,
    }
}
export function getPositionDelta(primary: TransformData, secondary: TransformData) {
    return {
        deltaX: secondary.left - primary.left,
        deltaY: secondary.top - primary.top,
    }
}
