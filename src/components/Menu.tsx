import React from 'react';
import { Action, FabricContext, Plugin } from '../lib/core';
import MenuActionItem, { MenuActionItemProps } from './MenuActionItem';
import { MenuPluginItem, MenuPluginItemProps } from './MenuPluginItem';

export type MenuProps = {
    context: FabricContext;
    onValueChange: (plugin: Plugin, value: boolean) => void;
    onActionTaken: (action: Action) => void;
    renderPlugin?: React.FC<MenuPluginItemProps>;
    renderAction?: React.FC<MenuActionItemProps>;

}

export function Menu(props: MenuProps) {
    const PluginRenderer = props.renderPlugin ?? MenuPluginItem;
    const ActionRenderer = props.renderAction ?? MenuActionItem;
    return (
        <div id="menu" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    props.context.plugins.map(
                        plugin => <PluginRenderer
                            key={plugin.getName()}
                            onValueChange={props.onValueChange}
                            plugin={plugin}
                            selected={props.context.state.selectedPluginName === plugin.getName()}
                        />
                    )
                }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    props.context.actions.map(
                        action => <ActionRenderer
                            key={action.getName()}
                            onTakeAction={props.onActionTaken}
                            action={action}
                        />
                    )
                }
            </div>
        </div>
    )
}
export default Menu;