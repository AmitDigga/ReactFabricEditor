import React, { CSSProperties, useEffect } from 'react';
import Editor from './components/Editor';
import Menu from './components/Menu';
import { PropertyWindows } from './components/PropertyWindow';
import { MenuItem } from "./lib/core/MenuItem";
import { OnChange } from './lib/core/Plugin';
import { CreateRectanglePlugin } from './lib/plugins/CreateRectanglePlugin';
import { SelectPlugin } from './lib/plugins/SelectPlugin';
import { ShowGridPlugin } from './lib/plugins/ShowGridPlugin';
import { XYLocationPlugin } from './lib/plugins/XYLocationPlugin';
import { useForceUpdate } from './hooks/useForceUpdate';


const plugins = [
    new SelectPlugin('Selection', false),
    new ShowGridPlugin('Show Grid', false),
    new CreateRectanglePlugin('Create Rectangle', false),
    new XYLocationPlugin('XY Position', false),
]
const menuItems: MenuItem[] = [
    {
        name: 'Selection',
        icon: undefined,
        value: false,
    },
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
    {
        name: 'XY Position',
        icon: undefined,
        value: false,
    },
]

const STYLES: Record<string, CSSProperties> = {
    container: {
        display: 'grid',
        gridTemplateAreas: `'editor menu' 'editor property-windows'`,
        gridTemplateColumns: '1fr 200px',
        gridTemplateRows: '250px 1fr'
    },
    editor: { border: '1px solid black' },
}

function App() {
    const forceUpdate = useForceUpdate();
    const newMenuItems = menuItems.map(menuItem => {
        return {
            ...menuItem,
            value: plugins.find(plugin => plugin.getName() === menuItem.name)?.getState() ?? false
        }
    });

    useEffect(() => {
        const onChangeFunction: OnChange<any> = () => {
            forceUpdate();
            console.log("updated");
        };
        plugins.forEach((plugin) => plugin.addPropertyChangeListener(onChangeFunction))
        return () => {
            plugins.forEach((plugin) => plugin.removePropertyChangeListener(onChangeFunction))
        }
    }, []);

    return (
        <div>
            <center>
                <h1>Welcome to our app</h1>
            </center>
            <div style={STYLES.container}>
                <div style={{ gridArea: 'editor' }}>
                    <Editor plugins={plugins} />
                </div>
                <div style={{ gridArea: 'menu' }}>
                    <Menu
                        menuItems={newMenuItems}
                        onValueChange={(menuItem, value) => {
                            switch (menuItem.name) {
                                case 'Selection':
                                    plugins[0].setState(value);
                                    break;
                                case 'Show Grid':
                                    plugins[1].setState(value);
                                    break;
                                case 'Create Rectangle':
                                    plugins[2].setState(value);
                                    break;
                                case 'XY Position':
                                    plugins[3].setState(value);
                                    break;
                                default:
                                    break;
                            }
                            forceUpdate();
                        }}
                    />
                </div>
                <div style={{ gridArea: 'property-windows' }}>
                    <h4>Properties</h4>

                    {
                        plugins.map(p =>
                            <PropertyWindows key={p.getName()} windowTitle={p.getName()} properties={p.getExposedProperty()}></PropertyWindows>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default App;