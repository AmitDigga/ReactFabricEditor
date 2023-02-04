import React, { useContext } from 'react';
import { IAction, IPlugin } from '../../lib/core/FabricRelated/interfaces/interface';
import { ReactFabricContext } from '../../provider-consumer';
import MenuActionItem, { MenuActionItemProps } from './MenuActionItem';
import { MenuPluginItem, MenuPluginItemProps } from './MenuPluginItem';

export type MenuProps = {
    onValueChange: (plugin: IPlugin, value: boolean) => void;
    onActionTaken: (action: IAction) => void;
    renderPlugin?: React.FC<MenuPluginItemProps>;
    renderAction?: React.FC<MenuActionItemProps>;

}

export function Menu(props: MenuProps) {
    const PluginRenderer = props.renderPlugin ?? MenuPluginItem;
    const ActionRenderer = props.renderAction ?? MenuActionItem;
    const context = useContext(ReactFabricContext);
    return (
        <div id="menu" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    context.plugins.map(
                        plugin => <PluginRenderer
                            key={plugin.getName()}
                            onValueChange={props.onValueChange}
                            plugin={plugin}
                            selected={context.state.selectedPluginName === plugin.getName()}
                        />
                    )
                }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    context.actions.map(
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