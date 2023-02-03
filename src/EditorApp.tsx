import React, { CSSProperties, useEffect, useState } from 'react';
import { useForceUpdate } from './hooks/useForceUpdate';
import { PropertyWindows, Menu, MenuPluginItemProps, Editor, MenuActionItemProps } from './components';
import { FabricContext, Property } from './lib/core';
import { useWatch } from './hooks/useWatch';

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

export type EditorAppProps = {
    context: FabricContext;
    canvasId: string;
    width: number;
    height: number;
    RenderPluginItem: React.FC<MenuPluginItemProps>,
    RenderActionItem: React.FC<MenuActionItemProps>,
    RenderPropertyRendererMap: Record<string, (property: Property<any>) => JSX.Element>;
}
function EditorApp(props: EditorAppProps) {
    const forceUpdate = useForceUpdate();
    const context = props.context;

    useWatch(context.pluginChange$);
    useWatch(context.commandManager.onChange$);

    useEffect(() => {
        return () => {
            context.destroy();
        }
    }, [])

    return (
        <div style={STYLES.container}>
            <div style={{ gridArea: 'editor' }}>
                <Editor
                    canvasId={props.canvasId}
                    width={props.width}
                    height={props.height}
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
                    renderPlugin={props.RenderPluginItem}
                    renderAction={props.RenderActionItem}
                />
            </div>
            <div style={{ gridArea: 'property-windows' }}>
                <PropertyWindows
                    context={context}
                    windowTitle='Exposed Properties'
                    customPropertyRenderer={props.RenderPropertyRendererMap}
                />
            </div>
        </div>
    )
}
export default EditorApp;