import { fabric } from 'fabric';
import { getRandomUid } from '../../utilities/getRandomUid';
import { CreateObjectPlugin } from '../CreateObjectPlugin';

export class CreateCirclePlugin extends CreateObjectPlugin<fabric.Circle, fabric.ICircleOptions> {

    constructor(name: string) {
        super(
            name,
            'circle',
            () => {
                return new fabric.Circle({
                    radius: 10,
                    fill: '#00000000',
                    stroke: '#00000FF',
                    name: getRandomUid(),
                    strokeUniform: true,
                });
            },
            (option) => {
                return {
                    radius: Math.abs(option.pointerX - option.startX) / 2,
                };
            },
            (object) => {
                return {
                    objectType: 'circle',
                    options: {
                        left: object.left,
                        top: object.top,
                        radius: object.radius,
                        fill: object.fill,
                        stroke: object.stroke,
                        strokeWidth: object.strokeWidth,
                        strokeUniform: object.strokeUniform,
                        name: object.name,
                    }
                }
            },
        );
    }
}
