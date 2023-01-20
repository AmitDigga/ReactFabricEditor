import React, { CSSProperties, useEffect, useState } from 'react';
import Editor from './components/Editor';
import Menu from './components/Menu';
import { MenuItem } from "./lib/core/MenuItem";
import { CreateRectanglePlugin } from './lib/plugins/CreateRectanglePlugin';
import { ShowGridPlugin } from './lib/plugins/ShowGridPlugin';


const plugins = [
    new ShowGridPlugin(),
    new CreateRectanglePlugin(),
]
const menuItems: MenuItem[] = [
    {
        name: 'Grid',
        icon: undefined,
    },
    {
        name: 'Other',
        icon: undefined,
    },
    {
        name: 'Create Rectangle',
        icon: undefined,
    },
]

const STYLES: Record<string, CSSProperties> = {
    container: { position: 'relative' },
    editor: { border: '1px solid black' },
    menu: {
        position: 'absolute',
        top: 0,
        left: 0,
        background: '#e8e8e8',
        borderRadius: 4,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',

    }
}

function App() {
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>(null);
    const [lastSelectedMenuItem, setLastSelectedMenuItem] = useState<MenuItem>(null);
    useEffect(() => {
        plugins.forEach(plugin => {
            if (plugin.getMenuItemName() === selectedMenuItem?.name) {
                plugin.onMenuItemSelected({});
            } else if (plugin.getMenuItemName() === lastSelectedMenuItem?.name) {
                plugin.onMenuItemUnselected({});
            }
        })
    },
        [selectedMenuItem?.name]
    )


    return (
        <div>
            <center>
                <h1>Welcome to our app</h1>
            </center>
            <div style={STYLES.container}>
                <Editor plugins={plugins} />
                <div style={STYLES.menu}>
                    <Menu
                        menuItems={menuItems}
                        selectedMenuItem={selectedMenuItem}
                        setSelectedMenuItem={item => {
                            setLastSelectedMenuItem(selectedMenuItem);
                            setSelectedMenuItem(item);
                        }} />
                </div>
            </div>
        </div>
    )
}
export default App;