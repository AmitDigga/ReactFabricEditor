import React from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { EveryObjectProperty } from '../../lib/properties/EveryObjectProperty';
import { EditorObject } from '../Editor';

export function ListObject({ property }: { property: EveryObjectProperty; }): JSX.Element {
    return <div>
        <h5>{property.name}</h5>
        <div>
            {property.getValue().map(p => {
                return <DisplayEditorObject object={p} canvas={property.canvas}></DisplayEditorObject>;
            })}
        </div>
    </div>;
}


export function DisplayEditorObject(props: { object: EditorObject; canvas?: fabric.Canvas; }) {
    const forceUpdate = useForceUpdate();
    const { object, canvas } = props;
    return <div
        onClick={(e) => {
            canvas?.setActiveObject(object.fabricObject);
            canvas?.requestRenderAll();
            forceUpdate();
        }}
        style={{
            padding: 5,
        }}
        key={object.name}>
        <div>{object.name}</div>
    </div>;
}
