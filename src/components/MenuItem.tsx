import React from 'react';
import { Plugin } from '../lib/core';


export type MenuItemProps = {
    plugin: Plugin;
    selected: boolean;
    onValueChange: (plugin: Plugin, value: boolean) => void;
}

export function MenuItem({ plugin, selected, onValueChange }: MenuItemProps) {
    const name = plugin.getName();
    return <div key={name}>
        <label htmlFor={name}>{name}</label>
        <input id={name} type='checkbox' checked={selected} onChange={(e) => {
            onValueChange(plugin, e.target.checked);
        }}></input>
    </div>;
}


export default MenuItem;