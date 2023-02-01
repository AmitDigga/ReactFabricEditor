import React from 'react';
import { Action, Plugin } from '../lib/core';


export type MenuActionItemProps = {
    action: Action;
    onTakeAction: (action: Action) => void;
}

export function MenuActionItem({ action, onTakeAction }: MenuActionItemProps) {
    const name = action.getName();
    return <div key={name}>
        <button id={name} onClick={(e) => {
            onTakeAction(action);
        }}></button>
    </div>;
}


export default MenuActionItem;