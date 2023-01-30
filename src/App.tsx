import React, { CSSProperties, useState } from 'react';
import Editor, { BaseState, FabricContext } from './components/Editor';
import Menu from './components/Menu';
import { PropertyWindows } from './components/PropertyWindow';
import { SelectedObjectLeftPositionProperty } from "./lib/properties/SelectedObjectLeftPositionProperty";
import { CreateRectanglePlugin } from './lib/plugins/CreateRectanglePlugin';
import { SelectPlugin } from './lib/plugins/SelectPlugin';
import { XYLocationPlugin } from './lib/plugins/XYLocationPlugin';
import { useForceUpdate } from './hooks/useForceUpdate';
import { SelectedObjectFillColorProperty } from './lib/properties/SelectedObjectFillColorProperty';
import { Plugin } from './lib/core/Plugin';
import { EveryObjectProperty } from './lib/properties/EveryObjectProperty';
import { SelectedObjectNameProperty } from './lib/properties/SelectedObjectNameProperty';
import { Property } from './lib/core/Property';
import { ListObjectTree } from './components/windows/ListObjectTree';


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