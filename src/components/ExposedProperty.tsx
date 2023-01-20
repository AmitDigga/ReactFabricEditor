import React from 'react';
import { ExposedPropertyType } from '../lib/core/Plugin';

export function ExposedProperty(props: { exposedProperty: ExposedPropertyType }) {
    if (props.exposedProperty.type === 'number') {
        return <div>
            <label htmlFor={props.exposedProperty.name}>{props.exposedProperty.name}</label>
            <input id={props.exposedProperty.name} type='number' value={props.exposedProperty.getValue()} onChange={(e) => {
                props.exposedProperty.setValue(e.target.value);
            }} />
        </div>
    } else {
        return <div>Not Supported {props.exposedProperty.name} of type {props.exposedProperty.type}</div>
    }
}