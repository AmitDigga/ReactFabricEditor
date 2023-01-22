import React, { useEffect, CSSProperties } from 'react';
import { useForceUpdate } from "../hooks/useForceUpdate";
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { Plugin } from '../lib/core/Plugin';
import { Property } from '../lib/core/Property';


const STYLES: Record<string, CSSProperties> = {
    canvas: { border: '1px solid black' },
    container: { position: 'relative' },
    menu: { position: 'absolute', top: 0, left: 0, background: '#e8e8e8', borderRadius: 4, padding: 10, display: 'flex', flexDirection: 'column' }
}


export type EditorProps = {
    plugins: Plugin<boolean>[];
    properties: Property<any>[];
}

function Editor(props: EditorProps) {
    const forceUpdate = useForceUpdate();

    const { fabricCanvas: canvasRef } = useFabricCanvas({ canvasId: 'canvas' });
    const canvas = canvasRef.current;
    useEffect(() => {
        if (!canvas) return;
        props.plugins.forEach(p => p.init(canvas));
        props.properties.forEach(p => p.init(canvas));

    }, [!!canvas])
    useEffect(() => {
        forceUpdate();
    }, [])


    return (
        <canvas height="600" width="600" id="canvas" style={STYLES.canvas}></canvas>
    )
}
export default Editor;