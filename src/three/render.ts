import {camera, renderer, scene} from './initialize';

export const render = () => {
    renderer.render(scene, camera);
};
