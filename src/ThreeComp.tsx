import { FC, useEffect, useRef } from 'react';
import {canvasElement, initialize} from './three/initialize';
import {animate} from './three/animate';

let componentIsMounted = false;

export const ThreeComp: FC = () => {
    useEffect(() => {
        if (componentIsMounted) {
            return;
        }

        componentIsMounted = true;

        initialize();
        animate();
    }, []);

  return (
    <canvas ref={canvasElement} />
  );
};
