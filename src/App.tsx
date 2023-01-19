import React from 'react';
import Editor from './Editor';
import { MenuItem } from "./lib/core/MenuItem";
import { CreateRectanglePlugin } from './lib/plugins/CreateRectanglePlugin';
import { ShowGridPlugin } from './lib/plugins/ShowGridPlugin';


const plugins = [
    new ShowGridPlugin(),
    new CreateRectanglePlugin(),
]
const menuItems: MenuItem[] = [
    {
        name: 'Grid',
        icon: undefined,
    },
    {
        name: 'Other',
        icon: undefined,
    },
    {
        name: 'Create Rectangle',
        icon: undefined,
    },
]

function App() {

    return (
        <div>
            <center>
                <h1>Welcome to our app</h1>
            </center>
            <Editor
                plugins={plugins}
                menuItems={menuItems}
            ></Editor>
        </div>
    )
}
export default App;