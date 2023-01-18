import { MutableRefObject, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
// import { RectangleDrawer } from './lib/RectangleDrawer';


export interface FabricEvents {
    // onRectCreated: (rect: fabric.Rect) => void;
    // onRectModified: (rect: fabric.Rect) => void;
}

export interface Options {
    canvasId: string,
    //  fabricEvents?: FabricEvents
}

export function useFabricCanvas({ canvasId }: { canvasId: string }): {
    fabricCanvas: MutableRefObject<fabric.Canvas>,
} {
    const fabricCanvas = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        fabricCanvas.current = new fabric.Canvas(canvasId);
        //     let rect = new RectangleDrawer(fabricCanvas.current);
        //     rect.onCreated = (object: fabric.Object) => {
        //         const rect = object as fabric.Rect;
        //         fabricEvents?.onRectCreated(rect);
        //     }

        //     rect.onModified = (object: fabric.Object) => {
        //         const rect = object as fabric.Rect;
        //         fabricEvents?.onRectModified(rect);
        // }

    }, [])
    return {
        fabricCanvas,
    };
} 
