import React from 'react';
import { IAction } from '../../lib/core';


export type MenuActionItemProps = {
    action: IAction;
    onTakeAction: (action: IAction) => void;
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