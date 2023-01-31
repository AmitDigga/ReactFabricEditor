import { DeleteOutline } from '@mui/icons-material';
import { Icon } from '@mui/material';
import React from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { FabricContext, EditorObject } from '../../lib/core';
import { EveryObjectProperty } from '../../lib/properties/EveryObjectProperty';

export function ListObjectTree({ property, context }: { property: EveryObjectProperty; context: FabricContext; }): JSX.Element {
    const forceUpdate = useForceUpdate();
    const parentObjects = (property.context?.state.editorObjects ?? [])
        .filter(o => o.parent == null);
    return <div>
        <h5>{property.name} ({property.context?.state.editorObjects.length ?? 0})</h5>
        <div>
            {parentObjects.map(p =>
                <DisplayParentEditorObject
                    onDropAction={() => { forceUpdate() }}
                    onClickAction={() => { forceUpdate() }}
                    key={p.id}
                    context={context}
                    object={p}
                    canvas={property.canvas} />)}
        </div>
    </div>;
}


export function DisplayParentEditorObject(props: { object: EditorObject; canvas?: fabric.Canvas; context: FabricContext; onDropAction: () => void, onClickAction: () => void }) {
    const { object, canvas } = props;
    function allowDrop(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
    }
    return <div
        draggable
        onDropCapture={(e) => {
            const data = e.dataTransfer.getData('text');
            props.context.setParentById(data, object.id);
        }}

        onDragOverCapture={allowDrop}
        onDragStartCapture={(e) => {
            e.dataTransfer.setData('text', object.id);
            props.onDropAction();
        }}
        style={{
            padding: 5,
        }}
        key={object.name}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: canvas?.getActiveObject()?.name === object.id ? 'lightblue' : 'white',
        }}>
            <div
                onClick={(e) => {
                    canvas?.setActiveObject(object.fabricObject);
                    canvas?.requestRenderAll();
                    props.onClickAction();
                }}>
                {object.name}
            </div>
            <Icon fontSize='small' component={DeleteOutline} onClick={() => {
                props.context.fabricCommandManager.addCommand({
                    type: 'remove-object',
                    data: { id: object.id },
                })
            }}></Icon>

        </div>
        <div style={{ paddingLeft: 10 }}>
            {object.children.map(child =>
                <DisplayParentEditorObject
                    onClickAction={props.onClickAction}
                    onDropAction={props.onDropAction}
                    key={child.id}
                    context={props.context}
                    object={child}
                    canvas={canvas}
                />)}
        </div>
    </div>;
}
