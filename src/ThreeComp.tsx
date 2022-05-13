import {
    AmbientLight,
    Camera,
    Clock,
    Color,
    Group,
    Mesh,
    MeshBasicMaterial,
    PlaneBufferGeometry,
    Scene,
    WebGLRenderer
} from 'three';
import {
    ArToolkitSource,
    ArToolkitContext,
    ArMarkerControls,
// @ts-ignore
} from '@ar-js-org/ar.js/three.js/build/ar-threex.js';
import { FC, useEffect, useRef } from 'react';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let componentIsMounted = false;

export const ThreeComp: FC = () => {
    const canvasElement = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (componentIsMounted) {
            return;
        }

        componentIsMounted = true;
        const scene = new Scene();

        const ambientLight = new AmbientLight(0x404040, 10.0);
        scene.add(ambientLight);

        const camera = new Camera();
        scene.add(camera);

        const renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: canvasElement.current as HTMLCanvasElement,
        });
        renderer.setClearColor(new Color('lightgrey'), 0);
        renderer.setSize(640, 480);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0px';
        renderer.domElement.style.left = '0px';

        const clock = new Clock();
        let deltaTime = 0;
        let totalTime = 0;

        const arToolkitSource = new ArToolkitSource({
            sourceType: 'webcam',
        });

        function onResize() {
            arToolkitSource.onResize()
            arToolkitSource.copySizeTo(renderer.domElement)
            if (arToolkitContext.arController !== null) {
                arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
            }
        }

        arToolkitSource.init(function onReady() {
            onResize();
        });

        window.addEventListener('resize', () => onResize());

        const arToolkitContext = new ArToolkitContext({
            cameraParametersUrl: `${process.env.PUBLIC_URL}/data/camera_para.dat`,
            detectionMode: 'mono',
        })

        arToolkitContext.init(function onComplete() {
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
        });

        const markerRoot1 = new Group();
        scene.add(markerRoot1);

        let markerControls1 = new ArMarkerControls(arToolkitContext, markerRoot1, {
            type: 'pattern',
            patternUrl: `${process.env.PUBLIC_URL}/data/pattern-frame.patt`,
        });
        let geometry1 = new PlaneBufferGeometry(1, 1, 4, 4);
        let material1 = new MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0.5,
            transparent: true,
        });

        const mesh1 = new Mesh(geometry1, material1);
        mesh1.rotation.x = -Math.PI / 2;
        markerRoot1.add(mesh1);

        function onProgress(xhr: any) {
            console.log((xhr.loaded / xhr.total) + '% loaded');
        }

        function  onError(xhr: any) {
            console.log('And error happened');
        }

        new GLTFLoader()
          .setPath(`${process.env.PUBLIC_URL}/models/skull/`)
          .load('scene.gltf', (gltf: GLTF) => {
              let mesh0 = gltf.scene;
              mesh0.position.x = 0;
              mesh0.position.y = 0.5;
              mesh0.position.z = 0;
              mesh0.scale.set(0.5, 0.5, 0.5)
              markerRoot1.add(mesh0);
          }, onProgress, onError);

        const update = () => {
            if (arToolkitSource.ready !== false) {
                arToolkitContext.update(arToolkitSource.domElement);
                onResize();
            }
        };

        const render = () => {
            renderer.render(scene, camera);
        };

        const animate = () => {
            requestAnimationFrame(animate);
            deltaTime = clock.getDelta();
            totalTime += deltaTime;
            update();
            render()
        };
        animate();
    }, []);

  return (
    <canvas
        ref={canvasElement}
    />
  );
};
