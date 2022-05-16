import {
    AmbientLight,
    Camera,
    Clock, Color,
    Group,
    Mesh,
    MeshBasicMaterial,
    PlaneBufferGeometry,
    Scene,
    WebGLRenderer
} from 'three';

// @ts-ignore
import {ArMarkerControls, ArToolkitContext, ArToolkitSource} from '@ar-js-org/ar.js/three.js/build/ar-threex';
import { GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { onError, onProgress } from './helpers';
import React, { LegacyRef } from 'react';

export let scene: Scene, ambientLight: AmbientLight, camera: Camera, renderer: WebGLRenderer, clock: Clock;
export let arToolkitSource: ArToolkitSource, arToolkitContext: ArToolkitContext, markerControls1: ArMarkerControls;
export let markerRoot1: Group, geometry1: PlaneBufferGeometry, material1: MeshBasicMaterial, mesh1: Mesh;
export let onResize: () => void;
export const canvasElement: LegacyRef<HTMLCanvasElement> = React.createRef();

export const initialize = () => {
    scene = new Scene();

    ambientLight = new AmbientLight(0x404040, 10.0);
    scene.add(ambientLight);

    camera = new Camera();
    scene.add(camera);

    renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: canvasElement.current as HTMLCanvasElement,
    });
    renderer.setClearColor(new Color('lightgrey'), 0);
    renderer.setSize(640, 480);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';

    clock = new Clock();

    arToolkitSource = new ArToolkitSource({
        sourceType: 'webcam',
    });

    onResize = () => {
        arToolkitSource.onResize()
        arToolkitSource.copySizeTo(renderer.domElement)
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
        }
    };

    arToolkitSource.init(function onReady() {
        onResize();
    });

    window.addEventListener('resize', () => onResize());

    arToolkitContext = new ArToolkitContext({
        cameraParametersUrl: `${process.env.PUBLIC_URL}/data/camera_para.dat`,
        detectionMode: 'mono',
    })

    arToolkitContext.init(function onComplete() {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    markerRoot1 = new Group();
    scene.add(markerRoot1);

    markerControls1 = new ArMarkerControls(arToolkitContext, markerRoot1, {
        type: 'pattern',
        patternUrl: `${process.env.PUBLIC_URL}/data/pattern-frame.patt`,
    });
    geometry1 = new PlaneBufferGeometry(1, 1, 4, 4);
    material1 = new MeshBasicMaterial({
        color: 0x0000ff,
        opacity: 0.5,
        transparent: true,
    });

    mesh1 = new Mesh(geometry1, material1);
    mesh1.rotation.x = -Math.PI / 2;
    markerRoot1.add(mesh1);

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
};
