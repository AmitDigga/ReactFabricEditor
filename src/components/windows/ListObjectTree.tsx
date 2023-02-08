import React, { useContext } from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { IEditorObject } from '../../lib/core/FabricRelated/interfaces/interface';
import { EveryObjectProperty } from '../../lib/properties/EveryObjectProperty';
import { ReactFabricContext } from '../../provider-consumer';

type ListObjectTreeProps = {
    property: EveryObjectProperty;
    getObjectName: (eo: IEditorObject) => string;
    onClickAction?: (eo: IEditorObject) => void;
};

export function ListObjectTree(props: ListObjectTreeProps): JSX.Element {
    const forceUpdate = useForceUpdate();
    const context = React.useContext(ReactFabricContext);
    const parentObjects: IEditorObject[] = (context.state.editorObjects ?? [] as IEditorObject[])
        .filter((o: IEditorObject) => o.parent == null);
    return <div>
        <h5>{props.property.name} ({context.state.editorObjects.length ?? 0})</h5>
        <div>
            {parentObjects.map(p =>
                <DisplayParentEditorObject
                    getObjectName={props.getObjectName}
                    onDropAction={() => { forceUpdate() }}
                    onClickAction={props.onClickAction ?? (() => { })}
                    key={p.id}
                    object={p} />)}
        </div>
    </div>;
}


type DisplayParentEditorObject = {
    getObjectName: (eo: IEditorObject) => string;
    object: IEditorObject;
    onDropAction: () => void;
    onClickAction: (eo: IEditorObject) => void;
};

export function DisplayParentEditorObject(props: DisplayParentEditorObject) {
    const { object, getObjectName } = props;
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
        }}>
            <div
                onClick={(e) => {
                    props.onClickAction(object);
                }}>
                {name}
            </div>
            <div onClick={() => {
                context.commandManager.addCommand({
                    type: 'remove-object',
                    data: { id: object.id },
                })
            }}>X</div>

        </div>
        <div style={{ paddingLeft: 10 }}>
            {object.children.map(child =>
                <DisplayParentEditorObject
                    getObjectName={props.getObjectName}
                    onClickAction={props.onClickAction}
                    onDropAction={props.onDropAction}
                    key={child.id}
                    object={child}
                />)}
        </div>
    </div>;
}
