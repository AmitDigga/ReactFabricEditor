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
            });
    }
}
