import React from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { EveryObjectProperty } from '../../lib/properties/EveryObjectProperty';
import { FabricContext, BaseState, EditorObject } from '../Editor';

export function ListObjectTree({ property, context }: { property: EveryObjectProperty; context: FabricContext<BaseState>; }): JSX.Element {
    const parentObjects = (property.context?.state.editorObjects ?? [])
        .filter(o => o.parent == null);
    return <div>
        <h5>{property.name}</h5>
        <div>
            {parentObjects.map(p => <DisplayParentEditorObject key={p.id} context={context} object={p} canvas={property.canvas} />)}
        </div>
    </div>;
}


export function DisplayParentEditorObject(props: { object: EditorObject; canvas?: fabric.Canvas; context: FabricContext<BaseState>; }) {
    const forceUpdate = useForceUpdate();
    const { object, canvas } = props;
    function allowDrop(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
    }
    return <div
        draggable
        onDropCapture={(e) => {
            const data = e.dataTransfer.getData('text');
            props.context.setParentById(data, object.id);
            forceUpdate();
        }}

        onDragOverCapture={allowDrop}
        onDragStartCapture={(e) => {
            e.dataTransfer.setData('text', object.id);
        }}
        onClick={(e) => {
            canvas?.setActiveObject(object.fabricObject);
            canvas?.requestRenderAll();
            forceUpdate();
        }}
        style={{
            padding: 5,
        }}
        key={object.name}>
        <div>
            {object.name}
        </div>
        <div style={{ paddingLeft: 10 }}>
            {object.children.map(child => <DisplayParentEditorObject key={child.id} context={props.context} object={child} canvas={canvas} />)}
        </div>
    </div>;
}
