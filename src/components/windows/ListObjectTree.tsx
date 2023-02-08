import React, { useContext } from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { IEditorObject } from '../../lib/core/FabricRelated/interfaces/interface';
import { EveryObjectProperty } from '../../lib/properties/EveryObjectProperty';
import { ReactFabricContext } from '../../provider-consumer';

type ListObjectTreeProps = {
    property: EveryObjectProperty;
    renderObject: (eo: IEditorObject) => JSX.Element;
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
                    renderObject={props.renderObject}
                    onDropAction={() => { forceUpdate() }}
                    key={p.id}
                    object={p} />)}
        </div>
    </div>;
}


type DisplayParentEditorObject = {
    object: IEditorObject;
    onDropAction: () => void;
    renderObject: (eo: IEditorObject) => JSX.Element;
};

export function DisplayParentEditorObject(props: DisplayParentEditorObject) {
    const { object } = props;
    const context = useContext(ReactFabricContext);
    function allowDrop(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
    }
    return <div
        draggable
        onDropCapture={(e) => {
            const data = e.dataTransfer.getData('text');
            if (data === object.id) return;
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
        key={object.id}>
        {props.renderObject(object)}
        <div style={{ paddingLeft: 10 }}>
            {object.children.map(child =>
                <DisplayParentEditorObject
                    renderObject={props.renderObject}
                    onDropAction={props.onDropAction}
                    key={child.id}
                    object={child}
                />)}
        </div>
    </div>;
}
