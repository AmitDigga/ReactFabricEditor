import React, { CSSProperties, useState } from 'react';
import { useForceUpdate } from './hooks/useForceUpdate';
import { SelectPlugin, CreateRectanglePlugin, XYLocationPlugin } from './lib/plugins';
import { NameProperty, LeftProperty, FillProperty, EveryObjectProperty, TopProperty, HeightProperty, SelectableProperty, WidthProperty } from './lib/properties';
import { RectangleOutlined, HighlightAltOutlined, Menu as MenuIcon } from '@mui/icons-material';
import { PropertyWindows, Menu, MenuItemProps, Editor, ListObjectTree } from './components';
import { BaseState, FabricContext, Plugin, Property } from './lib/core';
import { FabricPersistance } from './lib/core/Persistance';


const plugins: Plugin[] = [
    new SelectPlugin('Selection', false),
    // new ShowGridPlugin('Show Grid', false),
    new CreateRectanglePlugin('Create Rectangle', false),
    new XYLocationPlugin('XY Position', false),
]
const properties = [
    new EveryObjectProperty("All Objects", "every-object-property", "global"),
    new NameProperty("Name", "string", plugins[0], ""),
    new LeftProperty("X", "number", plugins[0], 0),
    new TopProperty("Y", "number", plugins[0], 0),
    new WidthProperty("Width", "number", plugins[0], 0),
    new HeightProperty("Height", "number", plugins[0], 0),
    new FillProperty("Fill Color", "color", plugins[0], "#000001"),
    new SelectableProperty("Selectable", "boolean", plugins[0], true),
];

const STYLES: Record<string, CSSProperties> = {
    container: {
        display: 'grid',
        gridGap: 10,
        gridTemplateAreas: `'menu editor property-windows'`,
        gridTemplateColumns: '40px auto 200px',
        gridTemplateRows: '1fr',
        justifyContent: 'start',
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

    const [context, setContext] = useState(
        new FabricContext<BaseState>({
            objectMap: new Map(),
            editorObjects: [],
            selectedPluginName: plugins[0].getName(),
        },
            plugins,
            properties,
        ));

    return (
        <div>
            <center>
                <h3>Welcome to our app</h3>
            </center>
            <div style={STYLES.container}>
                <div style={{ gridArea: 'editor' }}>
                    <Editor
                        onCanvasReady={(canvas) => {
                            context.init(canvas);
                        }}
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
                    <button
                        key={context.fabricCommandManager.commands.length}
                        onClick={() => {
                            context.fabricCommandManager.undo();
                        }}
                        disabled={!context.fabricCommandManager.canUndo()}
                    >Undo</button>
                    <button
                        onClick={() => {
                            const string = new FabricPersistance(
                                plugins,
                                properties,
                                context.canvas as any,
                            ).save(context);
                            window.localStorage.setItem('data', string);
                        }}
                    >Save</button>
                    <button
                        onClick={() => {
                            const string = window.localStorage.getItem('data');
                            const canvas = context.canvas as fabric.Canvas;
                            if (string === null) return;
                            context.reset();
                            canvas.clear();
                            const c = new FabricPersistance(
                                plugins,
                                properties,
                                context.canvas as any,
                            ).load(string);
                            setContext(c);
                        }}
                    >Load</button>
                </div>
                <div style={{ gridArea: 'property-windows' }}>
                    <PropertyWindows
                        context={context}
                        windowTitle='Exposed Properties'
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