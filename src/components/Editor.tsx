import React, { useEffect, CSSProperties } from 'react';
import { useForceUpdate } from "../hooks/useForceUpdate";
import { useFabricCanvas } from '../hooks/useFabricCanvas';


const STYLES: Record<string, CSSProperties> = {
    canvas: { border: '1px solid black' },
}

export type EditorProps = {
    onCanvasReady?: (canvas: fabric.Canvas) => void;
}

export function Editor(props: EditorProps) {
    const forceUpdate = useForceUpdate();
    const { fabricCanvas: canvasRef } = useFabricCanvas({ canvasId: 'canvas' });
    const canvas = canvasRef.current;
    useEffect(() => {
        if (!canvas) return;
        props.onCanvasReady?.(canvas);
    }, [!!canvas])
    useEffect(() => {
        forceUpdate();
    }, [])


    return (
        <canvas height="600" width="600" id="canvas" style={STYLES.canvas}></canvas>
    )
}
export default Editor;