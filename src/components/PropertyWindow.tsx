import React, { useContext } from 'react';
import { Property } from "../lib/core";
import { ReactFabricContext } from '../provider-consumer';
import { ExposedProperty } from './ExposedProperty';

export type PropertyWindowsProps = {
    windowTitle: string;
    customPropertyRenderer?: {
        [key: string]: (property: Property<any>) => JSX.Element;
    };
};
export function PropertyWindows(props: PropertyWindowsProps) {
    const context = useContext(ReactFabricContext);
    const { properties } = context;
    const child = properties.length === 0 ?
        <div>Empty</div> :
        <>
            {properties
                .filter(property => property.scope == 'global' || property.scope.getName() === context.state.selectedPluginName)
                .map((p) => {
                    if (props.customPropertyRenderer?.[p.type] !== undefined) {
                        return props.customPropertyRenderer[p.type](p);
                    }
                    else {
                        return <ExposedProperty key={p.name} property={p} />
                    }
                })}
        </>

    return <div>
        <h5>{props.windowTitle}</h5>
        {child}
    </div>
}
export default PropertyWindows;
