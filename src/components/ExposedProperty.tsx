import React, { useEffect } from 'react';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { Property } from "../lib/core/Property";

export type ExposedPropertyProps = {
    property: Property;
};

export function ExposedProperty(props: ExposedPropertyProps) {
    const forceUpdate = useForceUpdate();
    useEffect(() => {
        const unsubscribe = props.property.change$.subscribe(() => {
            forceUpdate();
        })
        return () => {
            unsubscribe.unsubscribe();
        }
    }, [props.property]);
    if (props.property.type === 'number') {
        return <div>
            <label htmlFor={props.property.name}>{props.property.name}</label>
            <input id={props.property.name} type='number' value={props.property.getValue()} onChange={(e) => {
                props.property.setValue(e.target.value);
            }} />
        </div>
    } else if (props.property.type === 'color') {
        return <div>
            <label htmlFor={props.property.name}>{props.property.name}</label>
            <input id={props.property.name} type='color' value={props.property.getValue()} onChange={(e) => {
                props.property.setValue(e.target.value);
            }} />
        </div>
    } else {
        return <div>Not Supported {props.property.name} of type {props.property.type}</div>
    }
}