import React from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { EveryObjectProperty } from '../../lib/properties/EveryObjectProperty';
import { IEditorObject } from '../../lib/core/FabricRelated/interfaces/interface';

export function ListObject({ property }: { property: EveryObjectProperty; }): JSX.Element {
    return <div>
        <h5>{property.name}</h5>
        <div>
            {property.getValue().map((p: IEditorObject) => {
                return <DisplayEditorObject object={p} canvas={property.context?.canvas}></DisplayEditorObject>;
            })}
        </div>
    </div>;
}


export function DisplayEditorObject(props: { object: IEditorObject; canvas?: fabric.Canvas; }) {
    const forceUpdate = useForceUpdate();
    const { object, canvas } = props;
    return <div
        onClick={(e) => {
            canvas?.setActiveObject(object.fabricObject);
            // canvas?.requestRenderAll();
            forceUpdate();
        }}
        style={{
            padding: 5,
        }}
        key={object.id}>
        <div>{object.id}</div>
    </div>;
}
