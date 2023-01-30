import React from 'react';
import { Plugin } from '../lib/core';
import { BaseState, FabricContext } from './Editor';
import { MenuItem, MenuItemProps } from './MenuItem';

export type MenuProps = {
    context: FabricContext<BaseState>;
    onValueChange: (plugin: Plugin, value: boolean) => void;
    customRenderer?: React.FC<MenuItemProps>;

}

function Menu(props: MenuProps) {
    const Renderer = props.customRenderer ?? MenuItem;
    return (
        <div id="menu">
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