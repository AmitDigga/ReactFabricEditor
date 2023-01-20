import React from 'react';
import { MenuItem } from '../lib/core/MenuItem';



export type MenuProps = {
    menuItems: MenuItem[];
    onValueChange: (menuItem: MenuItem, value: boolean) => void;
}

function Menu(props: MenuProps) {
    return (
        <div id="menu">
            {
                props.menuItems.map(
                    menuItem => {
                        return <div key={menuItem.name}>
                            <label htmlFor={menuItem.name}>{menuItem.name}</label>
                            <input id={menuItem.name} type='checkbox' checked={menuItem.value} onChange={(e) => {
                                props.onValueChange(menuItem, e.target.checked);
                            }} ></input>
                        </div>
                    }
                )
            }
        </div>
    )
}
export default Menu;