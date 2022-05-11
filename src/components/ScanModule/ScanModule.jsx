// import * as THREE from '../../js/three';
// import '../../js/MTLLoader';
// import '../../js/OBJLoader';
//
// import '../../jsartoolkit5/artoolkit.min';
// import '../../jsartoolkit5/artoolkit.api';
//
// import * as THREEx from '../../threex/threex-artoolkitsource';
// import '../../threex/threex-artoolkitcontext';
// import '../../threex/threex-arbasecontrols';
// import '../../threex/threex-armarkercontrols';
// import '../../threex/';



export function ScanModule() {
    initialize();
    animate();

    function initialize() {
        let scene = new THREE.Scene();

        let ambientLight = new THREE.AmbientLight( 0xcccccc, 1.0 );
        scene.add( ambientLight );

        let camera = new THREE.Camera();
        scene.add(camera);

        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(new THREE.Color('lightgrey'), 0);
        renderer.setSize(640, 480);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0px';
        renderer.domElement.style.left = '0px';
        document.body.appendChild( renderer.domElement);

        let clock = new THREE.Clock();
        let deltaTime = 0;
        let totalTime = 0;

        let arToolkitSource = new THREEx.ArToolkitSource({
            sourceType: 'webcam',
        });

        function onResize() {
            arToolkitSource.onResize();
            arToolkitSource.copySizeTo(renderer.domElement);

            if (arToolkitContext.arController !== null) {
                arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
            }
        }

        arToolkitSource.init(function onReady() {
            onResize()
        });

        window.addEventListener('resize', function () {
            onResize();
        })

        let arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: 'data/camera_para.dat',
            detectionMode: 'mono',
        });

        arToolkitContext.init(function onCompleted() {
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
        });

        let markerRoot1 = new THREE.Group();
        scene.add(markerRoot1);
        let markerControls1 = new THREEx.ArMultiMarkerControls(arToolkitContext, markerRoot1, {
            type: 'pattern', patternUrl: 'data/hiro.patt',
        })

        let geometry1 = new THREEx.PlaneBufferGeometry(1, 1, 4, 4);
        let loader = new THREE.TextureLoader();
        let material1 = new THREE.MeshBasicMaterial({ color: 0x0000ff, opacity: 0.5 });
        let mesh1 = THREE.Mesh (geometry1, material1);
        mesh1.rotation.x = -Math.PI/2;
        markerRoot1.add(mesh1);

        function onProgress(xhr) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); }
        function onError(xhr) { console.log( 'An error happened' ); }

        new THREE.MTLLoader()
          .setPath('/models')
          .load('fish-2.mtl', function (material) {
              material.preload();
              new THREE.OBJLoader()
                .setMaterials(material)
                .setPath('models/')
                .load('fish-2.obj', function (group) {
                    let mesh0 = group.children[0];
                    mesh0.material.side = THREE.DoubleSide;
                    mesh0.position.y = 0.25;
                    mesh0.scale.set(0.25, 0.25, 0.25);
                    markerRoot1.add(mesh0);
                }, onProgress, onError);
          });
    }

    function update() {
        if (arToolkitSource.ready !== false) {
            arToolkitContext.update(arToolkitSource.domElement);
        }
    }

    function render() {
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        deltaTime = clock.getDelta();
        totalTime += deltaTime;
        update();
        render();
    }
    return (
        <div>
            123
        </div>
    );
}
