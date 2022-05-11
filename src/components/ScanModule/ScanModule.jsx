import {
    AmbientLight,
    Camera,
    Clock,
    Color, DoubleSide, Mesh,
    MeshBasicMaterial,
    PlaneBufferGeometry,
    Scene,
    TextureLoader,
    WebGLRenderer
} from 'three';
import * as THREEx from 'ar-js-org/three.js/build/ar-threex';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

export const ScanModule = () => {
    let scene, camera, renderer, clock, deltaTime, totalTime;
    let arToolkitSource, arToolkitContext;
    let markerRoot1;
    let mesh1;

    const initialize = () => {
        scene = new Scene();

        const ambientLight = new AmbientLight(0xcccccc, 1.0);
        scene.add(ambientLight);

        camera = new Camera();
        scene.add(camera);

        renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(new Color('lightgrey'), 0);
        renderer.setSize(640, 480);
        renderer.domElement.style.position = 'absolute';  //* 11111
        renderer.domElement.style.top = '0px'; //* 11111
        renderer.domElement.style.left = '0px'; //* 11111
        document.body.appendChild( renderer.domElement ); //* 11111

        clock = new Clock();
        deltaTime = 0;
        totalTime = 0;

        arToolkitSource = new THREEx.ArToolkitSource({
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

        arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: '../../data/camera_para.dat',
            detectionMode: 'mono',
        })

        arToolkitContext.init(function onComplete() {
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
        });

        markerRoot1 = new THREEx.Group();
        scene.add(markerRoot1);

        let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
            type: 'pattern',
            patternUrl: "../../data/hiro.patt",
        });
        let geometry1 = new PlaneBufferGeometry(1, 1, 4, 4);
        let loader = new TextureLoader();
        let material1 = new MeshBasicMaterial({
            color: '0x0000ff',
            opacity: 0.5,
        });

        mesh1 = new Mesh(geometry1, material1);
        mesh1.rotation.x = -Math.PI/2;
        markerRoot1.add(mesh1);

        function onProgress(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }

        function  onError(xhr) {
            console.log('And error happened');
        }

        new MTLLoader()
          .setPath('../../models')
          .load('fish-2.mtl', (materials) => {
              materials.preload();
              new OBJLoader()
                .setMaterials(materials)
                .setPath('../../models')
                .load('fish-2.obj', (group) => {
                    let mesh0 = group.children[0];
                    mesh0.material.side = DoubleSide;
                    mesh0.position.y = 0.25;
                    mesh0.scale.set(0.25, 0.25, 0.25);
                    markerRoot1.add(mesh0);
                }, onProgress, onError);
          })
    };

    const update = () => {
        if (arToolkitSource.ready !== false) {
            arToolkitContext.update(arToolkitSource.domElement);
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

    return (
        <div>
            123
        </div>
    );
}
