import { EditorObjectData } from "./EditorObjectData";
import { IDestroyable } from "./interfaces/IDestroyable";
import { IEditorObject, IEditorObjectData } from "./interfaces/interface";

export class EditorObject implements IDestroyable, IEditorObject {
    id: string;
    parent: IEditorObject | null;
    children: IEditorObject[];
    fabricObject: fabric.Object;
    tempPositionData: TransformData;
    data: IEditorObjectData;

    constructor(id: string, fabricObject: fabric.Object) {
        this.id = id;
        this.fabricObject = fabricObject;
        this.parent = null;
        this.children = [];
        this.tempPositionData = getObjectData(fabricObject);
        this.fabricObject.on('mousedown:before', this.onMouseDown);
        this.fabricObject.on('moving', this.onMove);
        this.data = new EditorObjectData();
    }

    destroy() {
        this.fabricObject.off('mousedown:before', this.onMouseDown);
        this.fabricObject.off('moving', this.onMove);
    }

    removeChild(id: string) {
        this.children = this.children.filter(c => c.id !== id);
    }

    moveChildToDifferentIndex(childId: string, newIndex: number): void {
        const child = this.children.find(c => c.id === childId);
        if (child) {
            let oldIndex = this.children.indexOf(child);
            if (oldIndex === newIndex) return;
            this.children.splice(newIndex, 0, child);
            if (newIndex < oldIndex) oldIndex++;
            this.children.splice(oldIndex, 1);
        }
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
    onMouseDown = (e: any) => {
        this.tempPositionData = getObjectData(this.fabricObject);
    };
    onMove = (e: any) => {
        const newTransform = getObjectData(this.fabricObject);
        const displacement = {
            dLeft: newTransform.left - this.tempPositionData.left,
            dTop: newTransform.top - this.tempPositionData.top,
        };
        this.tempPositionData = newTransform;
        this.moveChildren(displacement)
    }
    public moveChildren(displacement: { dLeft: number, dTop: number }) {
        this.children.forEach(child => {
            child.fabricObject.set({
                left: (child.fabricObject.left ?? 0) + displacement.dLeft,
                top: (child.fabricObject.top ?? 0) + displacement.dTop,
            });
            child.moveChildren(displacement);
        });
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
