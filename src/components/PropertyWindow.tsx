import React from 'react';
import { Property, FabricContext } from "../lib/core";
import { ExposedProperty } from './ExposedProperty';

export type PropertyWindowsProps = {
    context: FabricContext,
    windowTitle: string;
    customPropertyRenderer?: {
        [key: string]: (property: Property<any>) => JSX.Element;
    };
};
export function PropertyWindows(props: PropertyWindowsProps) {
    const { context: { properties } } = props;
    const child = properties.length === 0 ?
        <div>Empty</div> :
        <>
            {properties
                .filter(property => property.scope == 'global' || property.scope.getName() === props.context.state.selectedPluginName)
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
