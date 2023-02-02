import { fabric } from 'fabric';
import { getRandomUid } from '../../utilities/getRandomUid';
import { CreateObjectPlugin } from '../CreateObjectPlugin';

export class CreateRectPlugin extends CreateObjectPlugin<fabric.Rect, fabric.IRectOptions> {

    constructor(name: string) {
        super(
            name,
            'rect',
            () => {
                return new fabric.Rect({
                    left: 100,
                    top: 100,
                    fill: '#00000000',
                    stroke: '#0000000',
                    strokeWidth: 1,
                    width: 20,
                    height: 20,
                    selectable: true,
                    strokeUniform: true,
                    name: getRandomUid(),
                });
            },
            (option) => {
                return {
                    width: option.pointerX - option.startX,
                    height: option.pointerY - option.startY,
                };
            },
            (object) => {
                return {
                    objectType: 'rect',
                    options: {
                        left: object.left,
                        top: object.top,
                        width: object.width,
                        height: object.height,
                        fill: object.fill,
                        stroke: object.stroke,
                        strokeWidth: object.strokeWidth,
                        strokeUniform: object.strokeUniform,
                        name: object.name,
                    }
                }
            });
    }


}
