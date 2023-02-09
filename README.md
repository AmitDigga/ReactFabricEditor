# React Fabric Editor

A simple project to create wrapper around [fabric.js](https://github.com/fabricjs/fabric.js), which is extensible, using [react](https://github.com/facebook/react).

 **_NOTE:_**  This is in development. Its API will change. It will be refactored heavily.

## Current Work

This project became a library for npm. So the code for below showcase is removed from this project. It will later be provided in different project later.

<https://user-images.githubusercontent.com/7884106/216349247-26240d76-5655-439d-a634-e8ac09f20b82.mp4>

## Description

1. Aim is to create an fabricjs editor where user can draw.
2. It should have menu options like creating a rectangle, or color picker.
3. Menu Option should be customizable.
4. Editor functionality should be customizable.
5. Editor functionality can be extended with custom plugin.

## Usage

### Concept

1. It has `FabricContext` at core.
2. `FabricContext` is wrapper around `fabric.js` with additional functionalities. We can add
    1. Plugin : Plugins is a class which works has two mode `selected` or `not selected`.
    2. Action : Action is a class which can be executed.
    3. Property : Property is a class use to link UI with `FabricContext`. Kind of two way data binding
3. Every fabric object has a wrapper around it called `EditorObject`. `EditorObject` has reference to fabric object, and also has a option to store meta data.
4. Every changes to canvas will happen through `Command`.


 A `CreateRectanglePlugin` will make changes to canvas by executing `Command` like `{type:'create-object', options: {...}}`. These executed command will be stored in `fabricContext.commandManager`. There we can undo command, save and reload commands. Changes to `editorObject.data` (meta-data of every object ) will also happen through commands only.

### API

#### Creating context

 ```typescript
 const context = new FabricContext()
 ```

#### Creating Custom Plugin

Now this is for sample only. Most of things are there for fabric.
On first mouse down it fixes left and top position of rectangle to the mouse position. On Second mouse down, it changes width and height to match the mouse position. 

One thing to look into `onMouseDown` function is that, on second mouse down it registers a command `type: 'create-object'`. This command internally creates a `fabric.Rect` and create `EditorObject`, set `EditorObject.fabricObject = fabric.Rect`.

 ```typescript
 export class CreateRectanglePlugin extends Plugin {

    private rect: fabric.Rect | null = null;
    private origin: fabric.Point | null = null;

    onInit(context: FabricContext): void {
        this.subscribeToEvents('mouse:down').subscribe(this.onMouseDown)
        this.subscribeToEvents('mouse:move').subscribe(this.onMouseMove)
        this.select$.subscribe((selected) => {
            if (selected) {
                this.createAndAddRect();
            } else {
                if (this.rect) {
                    this.context?.canvas?.remove(this.rect);
                }
            }
        })
    }

    createAndAddRect() {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        this.rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: '#00000000',
            stroke: '#0000000',
            strokeWidth: 1,
            width: 20,
            height: 20,
            selectable: true,
            strokeUniform: true,
        });
        canvas.add(this.rect);
    }

    onMouseDown = (event: fabric.IEvent) => {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (this.rect === null) throw new Error('Rect is null');
        if (!event.pointer) { return; }

        if (!this.origin) {
            this.origin = new fabric.Point(event.pointer.x, event.pointer.y);
        } else {
            this.context?.commandManager
                .addCommand({
                    type: 'create-rectangle',
                    data: {
                        ...this.rect.toObject(),
                        name: getRandomUid(),
                    },
                })
            canvas?.remove(this.rect);
            this.createAndAddRect();
            this.origin = null;
        }
    }
    onMouseMove = (event: fabric.IEvent) => {
        const canvas = this.context?.canvas;
        if (!canvas) throw new Error('Canvas is null');
        if (this.rect === null) throw new Error('Rect is null');
        if (!event.pointer) { return; }

        if (!!this.origin) {
            this.rect.set('width', event.pointer.x - this.origin.x);
            this.rect.set('height', event.pointer.y - this.origin.y);
        } else {
            this.rect.set('left', event.pointer.x);
            this.rect.set('top', event.pointer.y);
        }
        canvas.requestRenderAll();
    }
}
 ```

 Using Plugins

 ```typescript
 const plugins: Plugin[] = [
    new CreateRectanglePlugin('Create Rect'),
]

plugins.forEach(plugin => {
    context.registerPlugin(plugin);
});
 ```

#### Creating Action

`SaveAction.ts`

```typescript
export class SaveAction extends Action {
    constructor(name: string, private save: (data: string) => void) {
        super(name);
    }
    onInit(context: FabricContext): void { }
    execute() {
        if (!this.context) throw new Error("Context is initialized");
        this.save(new FabricCommandPersistance().save(this.context.commandManager.commands))
    }
}

```

`LoadActon.ts`

```typescript
export class LoadAction extends Action {
    constructor(name: string, private load: () => string | null) {
        super(name);
    }
    onInit(context: FabricContext): void { }
    execute() {
        if (!this.context) throw new Error("Context is not initialized");
        const string = this.load();
        if (string === null) return;
        const commands = new FabricCommandPersistance().load(string);
        this.context.commandManager.setCommands(commands);
    }
}

```


Using Actions

```typescript
const actions: Action[] = [
    new SaveAction('Save', (text) => { window.localStorage.setItem('fabric', text) }),
    new LoadAction('Load', () => { return window.localStorage.getItem('fabric') ?? null }),
]
actions.forEach(action => {
    context.registerAction(action);
})


```

#### Creating Property

TODO

## Development

### Creating build

```ps
npm run build
```

### Running type check

```ps
npm run start:types
```
