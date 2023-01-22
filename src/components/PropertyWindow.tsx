import React from 'react';
import { Property } from "../lib/core/Property";
import { ExposedProperty } from './ExposedProperty';

export type PropertyWindowsProps = {
    windowTitle: string;
    properties: Property[];
};
export function PropertyWindows(props: PropertyWindowsProps) {
    const child = props.properties.length === 0 ?
        <div>Empty</div> :
        <>
            {props.properties.map((p) => {
                return <ExposedProperty key={p.name} property={p} />
            })}
        </>

    return <div>
        <h5>{props.windowTitle}</h5>
        {child}
    </div>
}