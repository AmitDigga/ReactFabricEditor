import React from 'react';
import { Plugin } from '../lib/core';
import { FabricContext } from "./FabricContext";
import { MenuItem, MenuItemProps } from './MenuItem';

export type MenuProps = {
    context: FabricContext;
    onValueChange: (plugin: Plugin, value: boolean) => void;
    customRenderer?: React.FC<MenuItemProps>;

}

export function Menu(props: MenuProps) {
    const Renderer = props.customRenderer ?? MenuItem;
    return (
        <div id="menu" style={{ display: 'flex', flexDirection: 'column' }}>
            {
                props.context.plugins.map(
                    plugin => <Renderer
                        key={plugin.getName()}
                        onValueChange={props.onValueChange}
                        plugin={plugin}
                        selected={props.context.state.selectedPluginName === plugin.getName()}
                    />
                )
            }
        </div>
    )
}
export default Menu;