import { DeleteOutline } from '@mui/icons-material';
import { Icon } from '@mui/material';
import React, { useContext } from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { IEditorObject } from '../../lib/core/FabricRelated/interfaces/interface';
import { EveryObjectProperty } from '../../lib/properties/EveryObjectProperty';
import { ReactFabricContext } from '../../provider-consumer';

export function ListObjectTree({ property, getObjectName }: { property: EveryObjectProperty; getObjectName: (eo: IEditorObject) => string }): JSX.Element {
    const forceUpdate = useForceUpdate();
    const context = React.useContext(ReactFabricContext);
    const parentObjects: IEditorObject[] = (context.state.editorObjects ?? [] as IEditorObject[])
        .filter((o: IEditorObject) => o.parent == null);
    return <div>
        <h5>{property.name} ({context.state.editorObjects.length ?? 0})</h5>
        <div>
            {parentObjects.map(p =>
                <DisplayParentEditorObject
                    getObjectName={getObjectName}
                    onDropAction={() => { forceUpdate() }}
                    onClickAction={() => { forceUpdate() }}
                    key={p.id}
                    object={p}
                    canvas={context.canvas} />)}
        </div>
    </div>;
}


export function DisplayParentEditorObject(props: { getObjectName: (eo: IEditorObject) => string, object: IEditorObject; canvas?: fabric.Canvas; onDropAction: () => void, onClickAction: () => void }) {
    const { object, canvas, getObjectName } = props;
    const context = useContext(ReactFabricContext);
    function allowDrop(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
    }
    const name = getObjectName(object);
    return <div
        draggable
        onDropCapture={(e) => {
            const data = e.dataTransfer.getData('text');
            context.commandManager.addCommand({
                type: 'set-parent',
                data: { childId: data, parentId: object.id },
            })
        }}

        onDragOverCapture={allowDrop}
        onDragStartCapture={(e) => {
            e.dataTransfer.setData('text', object.id);
            props.onDropAction();
        }}
        style={{
            padding: 5,
        }}
        key={name}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: canvas?.getActiveObject()?.name === object.id ? 'lightblue' : 'white',
        }}>
            <div
                onClick={(e) => {
                    canvas?.setActiveObject(object.fabricObject);
                    // canvas?.requestRenderAll();
                    props.onClickAction();
                }}>
                {name}
            </div>
            <Icon fontSize='small' component={DeleteOutline} onClick={() => {
                context.commandManager.addCommand({
                    type: 'remove-object',
                    data: { id: object.id },
                })
            }}></Icon>

        </div>
        <div style={{ paddingLeft: 10 }}>
            {object.children.map(child =>
                <DisplayParentEditorObject
                    getObjectName={props.getObjectName}
                    onClickAction={props.onClickAction}
                    onDropAction={props.onDropAction}
                    key={child.id}
                    object={child}
                    canvas={canvas}
                />)}
        </div>
    </div>;
}
