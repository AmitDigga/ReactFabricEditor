import { MutableRefObject, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export interface Options {
    canvasId: string,
}

export function useFabricCanvas({ canvasId }: Options): {
    fabricCanvas: MutableRefObject<fabric.Canvas | null>,
} {
    const fabricCanvas = useRef<fabric.Canvas | null>(null);
    useEffect(() => {
        fabricCanvas.current = new fabric.Canvas(canvasId);
    }, [])
    return {
        fabricCanvas,
    };
} 
