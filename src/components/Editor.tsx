import React, { useEffect, CSSProperties } from 'react';
import { useForceUpdate } from "../hooks/useForceUpdate";
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { Property } from '../lib/core/Property';
import { FabricContext } from './FabricContext';


const STYLES: Record<string, CSSProperties> = {
    canvas: { border: '1px solid black' },
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