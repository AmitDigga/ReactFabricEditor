import React, { useEffect, useState, CSSProperties } from 'react';
import { fabric } from 'fabric';
import { useFabricCanvas } from './FabricCanvas';
import { MenuItem } from './lib/core/MenuItem';
import { Plugin } from './lib/core/Plugin';


const STYLES: Record<string, CSSProperties> = {
    canvas: { border: '1px solid black' },
    container: { position: 'relative' },
    menu: { position: 'absolute', top: 0, left: 0, background: '#e8e8e8', borderRadius: 4, padding: 10, display: 'flex', flexDirection: 'column' }
}

type MenuItemType = 'Select' | 'Rect';

export type EditorProps = {
    plugins: Plugin[];
    menuItems: MenuItem[];
}

function Editor(props: EditorProps) {

    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>('Select');
    const [newSelectedMenuItem, setNewSelectedMenuItem] = useState<MenuItem>(null);

    const { fabricCanvas: canvasRef } = useFabricCanvas({ canvasId: 'canvas' });
    const canvas = canvasRef.current;
    useEffect(() => {
        if (!canvas) return;
        props.plugins.forEach(p => p.init(canvas));

    }, [!!canvas])

    useEffect(() => {
        props.plugins.forEach(plugin => {
            if (plugin.getMenuItemName() === newSelectedMenuItem?.name) {
                plugin.onMenuItemSelected({});
            } else {
                plugin.onMenuItemUnselected({});
            }
        })
    },
        [newSelectedMenuItem?.name]
    )
    useEffect(() => {
        if (!canvas) return;
        const onMouseDown = (e: fabric.IEvent<MouseEvent>): void => {
            canvas.selection = false;
            if (selectedMenuItem == 'Rect') {
                canvas.add(new fabric.Rect({
                    left: e.pointer.x,
                    top: e.pointer.y,
                    width: 30,
                    height: 30,
                }));
                canvas.discardActiveObject();
            } else if (selectedMenuItem === 'Select') {
                canvas.selection = true;
            }
        };
        canvas.on('mouse:down', onMouseDown)
        return () => {
            canvas.off("mouse:down", onMouseDown)
        }

    }, [!!canvas, selectedMenuItem])

    return (
        <div style={STYLES.container}>
            <canvas height="600" width="600" id="canvas" style={STYLES.canvas}></canvas>
            <div id="menu" style={STYLES.menu}>
                {
                    props.menuItems.map(
                        menuItem => {
                            return <div key={menuItem.name}>
                                <label htmlFor={menuItem.name}>{menuItem.name}</label>
                                <input id={menuItem.name} type={'radio'} checked={newSelectedMenuItem?.name === menuItem.name} onChange={(e) => {
                                    setNewSelectedMenuItem(menuItem);
                                }} ></input>
                            </div>
                        }
                    )
                }
                <div>
                    <label htmlFor='radio-select'>Select</label>
                    <input id='radio-select' type='radio' checked={selectedMenuItem == 'Select'} onChange={() => { setSelectedMenuItem('Select') }} />
                </div>
                <div>
                    <label htmlFor='radio-rect'>Rectangle</label>
                    <input id='radio-rect' type='radio' checked={selectedMenuItem == 'Rect'} onChange={() => { setSelectedMenuItem('Rect') }} />
                </div>
            </div>
        </div>
    )
}
export default Editor;