import React, { CSSProperties, useEffect, useState } from 'react';
import { useForceUpdate } from './hooks/useForceUpdate';
import { SelectPlugin, CreateRectanglePlugin, CreateRectPlugin, CreateCirclePlugin } from './lib/plugins';
import { LoadAction, SaveAction, UndoAction } from './lib/actions';
import { LeftProperty, FillProperty, EveryObjectProperty, TopProperty, HeightProperty, SelectableProperty, WidthProperty } from './lib/properties';
import { RectangleOutlined, HighlightAltOutlined, Menu as MenuIcon, UndoOutlined, SaveOutlined, DownloadOutlined, CircleOutlined } from '@mui/icons-material';
import { PropertyWindows, Menu, MenuPluginItemProps, Editor, ListObjectTree, MenuActionItemProps } from './components';
import { Action, FabricContext, FabricCommandPersistance, Plugin, Property } from './lib/core';
import { useWatch } from './hooks/useWatch';


const plugins: Plugin[] = [
    new SelectPlugin('Selection'),
    // new ShowGridPlugin('Show Grid', false),
    new CreateRectPlugin('Create Rect'),
    new CreateCirclePlugin('Create Circle'),
]

const actions: Action[] = [
    new UndoAction('Undo'),
    new SaveAction('Save', (text) => { window.localStorage.setItem('fabric', text) }),
    new LoadAction('Load', () => { return window.localStorage.getItem('fabric') ?? null }),
]
const properties = [
    new EveryObjectProperty("All Objects", "every-object-property", "global"),
    // new NameProperty("Name", "string", plugins[0], ""),
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

function getIconFor(item: Plugin | Action) {
    switch (item.getName()) {
        case 'Selection':
            return HighlightAltOutlined;
        case 'Create Rect':
            return RectangleOutlined;
        case 'Create Circle':
            return CircleOutlined;
        case 'Undo':
            return UndoOutlined;
        case 'Save':
            return SaveOutlined;
        case 'Load':
            return DownloadOutlined;
        default:
            return MenuIcon;
    }
}

function CustomPluginItem(props: MenuPluginItemProps) {
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

function CustomActionItem(props: MenuActionItemProps) {
    const { action, onTakeAction } = props;
    const color = 'secondary';
    const Icon = getIconFor(action);
    return (
        <Icon
            style={{ padding: 5 }}
            component={Icon}
            color={color}
            onClick={() => { onTakeAction(action) }}
        />
    )
}

function App() {
    const forceUpdate = useForceUpdate();

    const [context, setContext] = useState(new FabricContext());

    useEffect(() => {
        plugins.forEach(plugin => {
            context.registerPlugin(plugin);
        });
        properties.forEach(property => {
            context.registerProperty(property);
        })
        actions.forEach(action => {
            context.registerAction(action);
        })
        forceUpdate();
    }, []);

    useWatch(context.pluginChange$);
    useWatch(context.commandManager.onChange$);

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
                        onActionTaken={(action) => {
                            action.execute();
                        }}
                        renderPlugin={CustomPluginItem}
                        renderAction={CustomActionItem}
                    />
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