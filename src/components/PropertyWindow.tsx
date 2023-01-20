import React from 'react';
import { ExposedPropertyType } from '../lib/core/Plugin';
import { ExposedProperty } from './ExposedProperty';

export type PropertyWindowsProps = {
    windowTitle: string;
    properties: ExposedPropertyType[];
};
export function PropertyWindows(props: PropertyWindowsProps) {
    const child = props.properties.length === 0 ?
        <div>Empty</div> :
        <>
            {props.properties.map((p) => {
                return <ExposedProperty key={p.name} exposedProperty={p} />
            })}
        </>

    return <div>
        <h5>{props.windowTitle}</h5>
        {child}
    </div>
}