import React, { CSSProperties, useState } from 'react';
import Editor, { BaseState, FabricContext } from './components/Editor';
import Menu from './components/Menu';
import { PropertyWindows } from './components/PropertyWindow';
import { MenuItem } from "./lib/core/MenuItem";
import { SelectedObjectLeftPositionProperty } from "./lib/properties/SelectedObjectLeftPositionProperty";
import { CreateRectanglePlugin } from './lib/plugins/CreateRectanglePlugin';
import { SelectPlugin } from './lib/plugins/SelectPlugin';
import { XYLocationPlugin } from './lib/plugins/XYLocationPlugin';
import { useForceUpdate } from './hooks/useForceUpdate';
import { SelectedObjectFillColorProperty } from './lib/properties/SelectedObjectFillColorProperty';
import { Plugin } from './lib/core/Plugin';
import { EveryObjectProperty } from './lib/properties/EveryObjectProperty';
import { SelectedObjectNameProperty } from './lib/properties/SelectedObjectNameProperty';


const plugins: Plugin<boolean>[] = [
    new SelectPlugin('Selection', false),
    // new ShowGridPlugin('Show Grid', false),
    new CreateRectanglePlugin('Create Rectangle', false),
    new XYLocationPlugin('XY Position', false),
]
const properties = [
    new SelectedObjectNameProperty("Name", "string", ""),
    new SelectedObjectLeftPositionProperty("Left Position", "number", 0),
    new SelectedObjectFillColorProperty("Fill Color", "color", "#000001"),
    new EveryObjectProperty("Every Object", "every-object-property")
];
const menuItems: MenuItem[] = [
    {
        name: 'Selection',
        icon: undefined,
        value: false,
    },
    // {
    //     name: 'Show Grid',
    //     icon: undefined,
    //     value: false,
    // },
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

    const [context] = useState(new FabricContext<BaseState>({
        objectMap: new Map(),
        editorObjects: [],
    }));

    return (
        <div>
            <center>
                <h1>Welcome to our app</h1>
            </center>
            <div style={STYLES.container}>
                <div style={{ gridArea: 'editor' }}>
                    <Editor
                        plugins={plugins}
                        properties={properties}
                        context={context}
                    />
                </div>
                <div style={{ gridArea: 'menu' }}>
                    <Menu
                        menuItems={newMenuItems}
                        onValueChange={(menuItem, value) => {
                            switch (menuItem.name) {
                                case 'Selection':
                                    plugins[0].setState(value);
                                    break;
                                // case 'Show Grid':
                                //     plugins[1].setState(value);
                                //     break;
                                case 'Create Rectangle':
                                    plugins[1].setState(value);
                                    break;
                                case 'XY Position':
                                    plugins[2].setState(value);
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
                    <PropertyWindows
                        windowTitle={'Exposed Properties'}
                        properties={properties}
                        customPropertyRenderer={{
                            'every-object-property': (property: EveryObjectProperty) => {
                                return <div>
                                    <h5>{property.name}</h5>
                                    <div>
                                        {property.getValue().map(p => {
                                            return <div
                                                onClick={(e) => {
                                                    property.canvas?.setActiveObject(p.fabricObject);
                                                    property.canvas?.requestRenderAll();
                                                    forceUpdate();
                                                }}
                                                style={{
                                                    padding: 5,
                                                    backgroundColor: p.fabricObject === property.canvas?.getActiveObject() ? 'lightblue' : 'white'
                                                }}
                                                key={p.name}>
                                                <div>{p.name}</div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
export default App;