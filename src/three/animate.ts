import {update} from './update';
import {render} from './render';
import {clock} from './initialize';

export const animate = () => {
    requestAnimationFrame(animate);

    let deltaTime = clock.getDelta();

    update();
    render()
};
