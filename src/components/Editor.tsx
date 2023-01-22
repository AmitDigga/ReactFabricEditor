import React, { useEffect, CSSProperties, useState } from 'react';
import { useForceUpdate } from "../hooks/useForceUpdate";
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { Plugin } from '../lib/core/Plugin';
import { Property } from '../lib/core/Property';


const STYLES: Record<string, CSSProperties> = {
    canvas: { border: '1px solid black' },
    container: { position: 'relative' },
    menu: { position: 'absolute', top: 0, left: 0, background: '#e8e8e8', borderRadius: 4, padding: 10, display: 'flex', flexDirection: 'column' }
}

export type EditorObject = {
    id: string;
    name: string;
    type: string;
    parent: EditorObject | null;
    children: EditorObject[];
    fabricObject: fabric.Object;
}

export type BaseState = {
    editorObjects: EditorObject[];
    objectMap: Map<fabric.Object, EditorObject>;
}
export class FabricContext<State extends BaseState>{
    constructor(public state: State) { }
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
        const editorObject = { id, type, children: [], parent: null, name: id, fabricObject: object };
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

    setParent(child: fabric.Object, parent: fabric.Object) {
        const { objectMap } = this.state;
        const parentEditorObject = objectMap.get(parent);
        const childEditorObject = objectMap.get(child);
        if (!parentEditorObject) {
            throw new Error("Parent object not found");
        }
        if (!childEditorObject) {
            throw new Error("Child object not found");
        }

        if (childEditorObject.parent) {
            const oldParent = childEditorObject.parent;
            oldParent.children = oldParent.children.filter(c => c.id !== childEditorObject.id);
        }
        childEditorObject.parent = parentEditorObject;
        parentEditorObject.children.push(childEditorObject);
    }
}

function getRandomUid(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


export type EditorProps = {
    plugins: Plugin<boolean>[];
    properties: Property<any>[];
    context: FabricContext<any>;
}

function Editor(props: EditorProps) {
    const forceUpdate = useForceUpdate();

    const { fabricCanvas: canvasRef } = useFabricCanvas({ canvasId: 'canvas' });
    const canvas = canvasRef.current;
    useEffect(() => {
        if (!canvas) return;
        props.plugins.forEach(p => p.init(canvas, props.context));
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