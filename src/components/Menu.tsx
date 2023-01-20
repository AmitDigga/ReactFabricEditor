import React, { useEffect, useState, CSSProperties } from 'react';
import { MenuItem } from '../lib/core/MenuItem';



export type MenuProps = {
    menuItems: MenuItem[];
    selectedMenuItem: MenuItem;
    setSelectedMenuItem: (menuItem: MenuItem) => void
}

function Menu(props: MenuProps) {
    return (
        <div id="menu">
            {
                props.menuItems.map(
                    menuItem => {
                        return <div key={menuItem.name}>
                            <label htmlFor={menuItem.name}>{menuItem.name}</label>
                            <input id={menuItem.name} type={'radio'} checked={props.selectedMenuItem?.name === menuItem.name} onChange={(e) => {
                                props.setSelectedMenuItem(menuItem);
                                // setLastNewSelectedMenuItem(props.newSelectedMenuItem);
                            }} ></input>
                        </div>
                    }
                )
            }
        </div>
    )
}
export default Menu;