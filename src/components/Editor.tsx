import React, { useEffect, CSSProperties } from 'react';
import { useForceUpdate } from "../hooks/useForceUpdate";
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { Plugin } from '../lib/core/Plugin';
import { Property } from '../lib/core/Property';


const STYLES: Record<string, CSSProperties> = {
    canvas: { border: '1px solid black' },
}

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
        }
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
            this.untrackParent(this.parent)
            this.parent.removeChild(this.id);
            this.parent = null;
        }
        this.trackParent(parentEditorObject);
        this.parent = parentEditorObject;
        this.parent.addChild(this);
    }
    onMouseDown(e: any) {
        if (!this.parent) return;
        this.dataOnClick.parent = getObjectData(this.parent.fabricObject);
        this.dataOnClick.child = getObjectData(this.fabricObject);
    };
    onMove(e: any) {
        if (!this.parent) return;
        this.fabricObject.set({
            left: this.dataOnClick.child.left + (this.parent.fabricObject.left ?? 0) - this.dataOnClick.parent.left,
            top: this.dataOnClick.child.top + (this.parent.fabricObject.top ?? 0) - this.dataOnClick.parent.top,
        });
    }
    onScale(e: any) {
        if (!this.parent) return;
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
        parent.fabricObject.off('mousedown:before', this.onMouseDown)
        parent.fabricObject.off('moving', this.onMove)
        parent.fabricObject.off('scaling', this.onScale)
    }
    trackParent(parent: EditorObject) {
        parent.fabricObject.on('mousedown:before', this.onMouseDown)
        parent.fabricObject.on('moving', this.onMove)
        parent.fabricObject.on('scaling', this.onScale)
    }

}

export type BaseState = {
    editorObjects: EditorObject[];
    objectMap: Map<fabric.Object, EditorObject>;
    selectedPluginName: string;
}
export class FabricContext<State extends BaseState>{
    constructor(
        public state: State,
        public plugins: Plugin[]
    ) { }


    selectPlugin(plugin: Plugin) {
        const previousPluginName = this.state.selectedPluginName;
        this.plugins.forEach(p => {
            if (p.getName() === previousPluginName) {
                p.onSelected(false)
            }
            if (p.getName() === plugin.getName()) {
                p.onSelected(true)
            }
        })
        this.state.selectedPluginName = plugin.getName();
    }

    updateState(state: State) {
        this.state = state;
    }

    getEditorObjectFromFabricObject(object: fabric.Object): EditorObject | null {
        return this.state.objectMap.get(object) || null;
    }

    addObject(canvas: fabric.Canvas, object: fabric.Object, type: string) {
        const id = getRandomUid();
        object.name = id;
        canvas.add(object)
        const editorObject = new EditorObject(id, id, type, object);
        this.state.editorObjects.push(editorObject);
        this.state.objectMap.set(object, editorObject);
    }
    removeObject(canvas: fabric.Canvas, object: fabric.Object) {
        const { objectMap, editorObjects } = this.state;
        const editorObject = objectMap.get(object);
        if (!editorObject) {
            throw new Error("Object not found");
        }
        objectMap.delete(object);
        editorObjects.splice(editorObjects.indexOf(editorObject), 1);
        canvas.remove(object);
    }

    getEditorObjectById(id: string) {
        return this.state.editorObjects.find(o => o.id === id);
    }

    setParentById(childId: string, parentId: string) {
        const { editorObjects } = this.state;
        const parent = editorObjects.find(o => o.id === parentId);
        const child = editorObjects.find(o => o.id === childId);
        if (!parent) {
            throw new Error("Parent object not found");
        }
        if (!child) {
            throw new Error("Child object not found");
        }
        child.setParent(parent);
    }
}
type TransformData = {
    width: number;
    height: number;
    left: number;
    top: number;
    scaleX: number;
    scaleY: number;
}
function getObjectData(object: fabric.Object): TransformData {
    return {
        width: object.width ?? 0,
        height: object.height ?? 0,
        left: object.left ?? 0,
        top: object.top ?? 0,
        scaleX: object.scaleX ?? 1,
        scaleY: object.scaleY ?? 1,
    }
}
function getPositionDelta(primary: TransformData, secondary: TransformData) {
    return {
        deltaX: secondary.left - primary.left,
        deltaY: secondary.top - primary.top,
    }
}

function getRandomUid(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


export type EditorProps = {
    properties: Property<any>[];
    context: FabricContext<any>;
}

export function Editor(props: EditorProps) {
    const forceUpdate = useForceUpdate();

    const { fabricCanvas: canvasRef } = useFabricCanvas({ canvasId: 'canvas' });
    const canvas = canvasRef.current;
    useEffect(() => {
        if (!canvas) return;
        props.context.plugins.forEach(p => p.init(canvas, props.context));
        props.properties.forEach(p => p.init(canvas, props.context));

    }, [!!canvas])
    useEffect(() => {
        forceUpdate();
    }, [])


    return (
        <canvas height="600" width="600" id="canvas" style={STYLES.canvas}></canvas>
    )
}
export default Editor;