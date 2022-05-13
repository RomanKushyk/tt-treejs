import {
    AmbientLight,
    Camera,
    Clock,
    Color, DoubleSide, Group, Mesh,
    MeshBasicMaterial,
    PlaneBufferGeometry,
    Scene,
    TextureLoader,
    WebGLRenderer
} from 'three';
import { ArToolkitProfile, ArToolkitSource, ArToolkitContext, ArMarkerControls} from '@ar-js-org/ar.js/three.js/build/ar-threex.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import React from 'react';

export default class ScanModule extends React.Component {
    componentDidMount() {
        const canvas = document.querySelector('canvas.webgl');
        const scene = new Scene();

        const ambientLight = new AmbientLight(0xcccccc, 1.0);
        scene.add(ambientLight);

        const camera = new Camera();
        scene.add(camera);

        const renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: canvas,
        });
        renderer.setClearColor(new Color('lightgrey'), 0);
        renderer.setSize(640, 480);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0px';
        renderer.domElement.style.left = '0px';
        // document.body.appendChild( renderer.domElement );

        const clock = new Clock();
        let deltaTime = 0;
        let totalTime = 0;

        const arToolkitSource = new ArToolkitSource({
            sourceType: 'webcam',
        });

        function onResize() {
            arToolkitSource.onResize()
            arToolkitSource.copySizeTo(renderer.domElement) //* 11111
            if (arToolkitContext.arController !== null) {
                arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
            }
        }

        arToolkitSource.init(function onReady() {
            onResize();
        });

        window.addEventListener('resize', () => onResize());

        const arToolkitContext = new ArToolkitContext({
            cameraParametersUrl: '../data/camera_para.dat',
            detectionMode: 'mono',
        })

        arToolkitContext.init(function onComplete() {
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
        });

        const markerRoot1 = new Group();
        scene.add(markerRoot1);

        let markerControls1 = new ArMarkerControls(arToolkitContext, markerRoot1, {
            type: 'pattern',
            patternUrl: "../data/hiro.patt",
        });
        let geometry1 = new PlaneBufferGeometry(1, 1, 4, 4);
        let loader = new TextureLoader();
        let material1 = new MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0,
            transparent: true,
        });

        const mesh1 = new Mesh(geometry1, material1);
        mesh1.rotation.x = -Math.PI / 2;
        markerRoot1.add(mesh1);

        function onProgress(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }

        function  onError(xhr) {
            console.log('And error happened');
        }

        new MTLLoader()
          .setPath('../models/')
          .load('fish-2.mtl', (materials) => {
              materials.preload();
              new OBJLoader()
                .setMaterials(materials)
                .setPath('../models/')
                .load('fish-2.obj', (group) => {
                    let mesh0 = group.children[0];
                    mesh0.material.side = DoubleSide;
                    mesh0.position.y = 0.25;
                    mesh0.scale.set(0.25, 0.25, 0.25);
                    markerRoot1.add(mesh0);
                }, onProgress, onError);
          })

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
    }

    render() {
        return (
          <canvas
            className="webgl"
            style={{ width: '800px', height: '800px' }}
            ref={mount => {this.mount = mount}}
          />
        );
    }
}
