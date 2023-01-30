import React, { CSSProperties, useState } from 'react';
import { useForceUpdate } from './hooks/useForceUpdate';
import { Plugin } from './lib/core/Plugin';
import { SelectPlugin, CreateRectanglePlugin, XYLocationPlugin } from './lib/plugins';
import { SelectedObjectNameProperty, SelectedObjectLeftPositionProperty, SelectedObjectFillColorProperty, EveryObjectProperty } from './lib/properties';
import { RectangleOutlined, HighlightAltOutlined, Menu as MenuIcon } from '@mui/icons-material';
import { PropertyWindows, Menu, MenuItem, MenuItemProps, Editor, FabricContext, BaseState, ListObjectTree } from './components';
import { Property } from './lib/core';


const plugins: Plugin[] = [
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

const STYLES: Record<string, CSSProperties> = {
    container: {
        display: 'grid',
        gridTemplateAreas: `'editor menu' 'editor property-windows'`,
        gridTemplateColumns: '1fr 200px',
        gridTemplateRows: '250px 1fr'
    },
    editor: { border: '1px solid black' },
}

function getIconFor(plugin: Plugin) {
    switch (plugin.getName()) {
        case 'Selection':
            return HighlightAltOutlined;
        case 'Create Rectangle':
            return RectangleOutlined;
        default:
            return MenuIcon;
    }
}

function CustomMenuItem(props: MenuItemProps) {
    const { plugin, selected } = props;
    const color = selected ? 'primary' : 'secondary';
    const Icon = getIconFor(plugin);
    return (
        <Icon
            style={{ padding: 5 }}
            component={Icon}
            color={color}
            onClick={() => { props.onValueChange(plugin, true) }}
        />
    )
}

function App() {
    const forceUpdate = useForceUpdate();
    const [context] = useState(new FabricContext<BaseState>({
        objectMap: new Map(),
        editorObjects: [],
        selectedPluginName: plugins[0].getName(),
    },
        plugins));

    return (
        <div>
            <center>
                <h1>Welcome to our app</h1>
            </center>
            <div style={STYLES.container}>
                <div style={{ gridArea: 'editor' }}>
                    <Editor
                        properties={properties}
                        context={context}
                    />
                </div>
                <div style={{ gridArea: 'menu' }}>
                    <Menu
                        context={context}
                        onValueChange={(plugin, value) => {
                            context.selectPlugin(plugin)
                            forceUpdate();
                        }}
                        customRenderer={CustomMenuItem}
                    />
                </div>
                <div style={{ gridArea: 'property-windows' }}>
                    <h4>Properties</h4>
                    <PropertyWindows
                        windowTitle={'Exposed Properties'}
                        properties={properties}
                        customPropertyRenderer={{
                            'every-object-property': (property: Property<any>) => {
                                return <ListObjectTree context={context} property={property as EveryObjectProperty} />
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
export default App;