import React from 'react';
import { IPlugin } from '../lib/core/FabricRelated/interfaces/interface';


export type MenuPluginItemProps = {
    plugin: IPlugin;
    selected: boolean;
    onValueChange: (plugin: IPlugin, value: boolean) => void;
}

export function MenuPluginItem({ plugin, selected, onValueChange }: MenuPluginItemProps) {
    const name = plugin.getName();
    return <div key={name}>
        <label htmlFor={name}>{name}</label>
        <input id={name} type='checkbox' checked={selected} onChange={(e) => {
            onValueChange(plugin, e.target.checked);
        }}></input>
    </div>;
}


export default MenuPluginItem;