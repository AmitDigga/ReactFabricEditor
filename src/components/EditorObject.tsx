export class EditorObject {
    id: string;
    name: string;
    type: string;
    parent: EditorObject | null;
    children: EditorObject[];
    fabricObject: fabric.Object;
    dataOnClick: {
        parent: TransformData;
        child: TransformData;
    };

    constructor(id: string, name: string, type: string, fabricObject: fabric.Object) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.fabricObject = fabricObject;
        this.parent = null;
        this.children = [];
        this.dataOnClick = {
            parent: getObjectData(fabricObject),
            child: getObjectData(fabricObject),
        };
        this.onMove = this.onMove.bind(this);
        this.onScale = this.onScale.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    removeChild(id: string) {
        this.children = this.children.filter(c => c.id !== id);
    }
    addChild(child: EditorObject) {
        this.children.push(child);
    }

    setParent(parentEditorObject: EditorObject) {
        if (this.parent) {
            this.untrackParent(this.parent);
            this.parent.removeChild(this.id);
            this.parent = null;
        }
        this.trackParent(parentEditorObject);
        this.parent = parentEditorObject;
        this.parent.addChild(this);
    }
    onMouseDown(e: any) {
        if (!this.parent)
            return;
        this.dataOnClick.parent = getObjectData(this.parent.fabricObject);
        this.dataOnClick.child = getObjectData(this.fabricObject);
    };
    onMove(e: any) {
        if (!this.parent)
            return;
        this.fabricObject.set({
            left: this.dataOnClick.child.left + (this.parent.fabricObject.left ?? 0) - this.dataOnClick.parent.left,
            top: this.dataOnClick.child.top + (this.parent.fabricObject.top ?? 0) - this.dataOnClick.parent.top,
        });
    }
    onScale(e: any) {
        if (!this.parent)
            return;
        const positionDelta = getPositionDelta(this.dataOnClick.parent, this.dataOnClick.child);
        const newScale = {
            scaleXFactor: (this.parent.fabricObject.scaleX ?? 1) / this.dataOnClick.parent.scaleX,
            scaleYFactor: (this.parent.fabricObject.scaleY ?? 1) / this.dataOnClick.parent.scaleY,
        };
        const newPosition = {
            left: this.dataOnClick.parent.left + positionDelta.deltaX * newScale.scaleXFactor,
            top: this.dataOnClick.parent.top + positionDelta.deltaY * newScale.scaleYFactor,
        };
        const newSize = {
            width: this.dataOnClick.child.width * newScale.scaleXFactor,
            height: this.dataOnClick.child.height * newScale.scaleYFactor,
        };
        this.fabricObject.set({
            ...newPosition,
            ...newSize,
        });
    }
    untrackParent(parent: EditorObject) {
        parent.fabricObject.off('mousedown:before', this.onMouseDown);
        parent.fabricObject.off('moving', this.onMove);
        parent.fabricObject.off('scaling', this.onScale);
    }
    trackParent(parent: EditorObject) {
        parent.fabricObject.on('mousedown:before', this.onMouseDown);
        parent.fabricObject.on('moving', this.onMove);
        parent.fabricObject.on('scaling', this.onScale);
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
