import {arToolkitContext, arToolkitSource, onResize} from './initialize';

export const update = () => {
    if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement);
        onResize();
    }
};
