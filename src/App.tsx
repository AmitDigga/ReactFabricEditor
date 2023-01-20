import React, { CSSProperties, useEffect, useState } from 'react';
import Editor from './components/Editor';
import Menu from './components/Menu';
import { MenuItem } from "./lib/core/MenuItem";
import { CreateRectanglePlugin } from './lib/plugins/CreateRectanglePlugin';
import { ShowGridPlugin } from './lib/plugins/ShowGridPlugin';


const plugins = [
    new ShowGridPlugin('Show Grid', false),
    new CreateRectanglePlugin('Create Rectangle', false),
]
const menuItems: MenuItem[] = [
    {
        name: 'Show Grid',
        icon: undefined,
        value: false,
    },
    {
        name: 'Create Rectangle',
        icon: undefined,
        value: false,
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

function useForceUpdate() {
    const [_, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

function App() {
    const forceUpdate = useForceUpdate();
    const newMenuItems = menuItems.map(menuItem => {
        return {
            ...menuItem,
            value: plugins.find(plugin => plugin.getName() === menuItem.name)?.getState()
        }
    });

    return (
        <div>
            <center>
                <h1>Welcome to our app</h1>
            </center>
            <div style={STYLES.container}>
                <Editor plugins={plugins} />
                <div style={STYLES.menu}>
                    <Menu
                        menuItems={newMenuItems}
                        onValueChange={(menuItem, value) => {
                            switch (menuItem.name) {
                                case 'Show Grid':
                                    plugins[0].setState(value);
                                    break;
                                case 'Create Rectangle':
                                    plugins[1].setState(value);
                                    break;
                                default:
                                    break;
                            }
                            forceUpdate();
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
export default App;