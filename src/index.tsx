import React from "react";
import { createRoot } from "react-dom/client";
import EditorApp from './EditorApp';
import { SelectPlugin, CreateRectPlugin, CreateCirclePlugin } from './lib/plugins';
import { LoadAction, SaveAction, ShowGridAction, UndoAction } from './lib/actions';
import { LeftProperty, FillProperty, EveryObjectProperty, TopProperty, HeightProperty, SelectableProperty, WidthProperty, NameProperty } from './lib/properties';
import { Action, FabricContext, Plugin, Property } from "./lib/core";
import { ListObjectTree, MenuActionItemProps, MenuPluginItemProps } from "./components";
import { RectangleOutlined, HighlightAltOutlined, Menu as MenuIcon, UndoOutlined, SaveOutlined, DownloadOutlined, CircleOutlined, GridOnOutlined } from '@mui/icons-material';
import { ReactFabricContext } from "./provider-consumer";

const element = document.getElementById("root");
if (element == null) {
    throw new Error("Root element not found");
}

const plugins: Plugin[] = [
    new SelectPlugin('Selection'),
    new CreateRectPlugin('Create Rect'),
    new CreateCirclePlugin('Create Circle'),
]

const actions: Action[] = [
    new UndoAction('Undo'),
    new SaveAction('Save', (text) => { window.localStorage.setItem('fabric', text) }),
    new LoadAction('Load', () => { return window.localStorage.getItem('fabric') ?? null }),
    new ShowGridAction('Show Grid'),
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

function getIconFor(item: Plugin | Action) {
    switch (item.getName()) {
        case 'Selection':
            return HighlightAltOutlined;
        case 'Create Rect':
            return RectangleOutlined;
        case 'Create Circle':
            return CircleOutlined;
        case 'Show Grid':
            return GridOnOutlined;
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

const context = new FabricContext();
plugins.forEach(plugin => {
    context.registerPlugin(plugin);
});
properties.forEach(property => {
    context.registerProperty(property);
})
actions.forEach(action => {
    context.registerAction(action);
})
const root = createRoot(element);
root.render(
    <ReactFabricContext.Provider value={context}>
        <EditorApp
            width={750}
            height={500}
            canvasId="canvas"
            RenderActionItem={CustomActionItem}
            RenderPluginItem={CustomPluginItem}
            RenderPropertyRendererMap={
                {
                    'every-object-property': (property: Property) => {
                        return <ListObjectTree getObjectName={(eo) => eo.data.getKey('name', eo.id) as string} property={property as EveryObjectProperty} />
                    }
                }
            }
        ></EditorApp>
    </ReactFabricContext.Provider>
)