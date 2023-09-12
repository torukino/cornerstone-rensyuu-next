import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let pointLight: THREE.PointLight;
let directionalLight: THREE.DirectionalLight;
let controls: OrbitControls;

export const earthThree = (canvas: HTMLElement) => {
  //gui
  // const gui = new GUI();
  // if (!gui) return;

  // window.addEventListener('load', init);
  init(canvas);
  function init(canvas: HTMLElement) {
    // add scene
    scene = new THREE.Scene();
    // add camera
    camera = new THREE.PerspectiveCamera(
      50,
      (canvas as HTMLCanvasElement).width /
        (canvas as HTMLCanvasElement).height, //window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(500, 0, -500);

    // add renderer
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas as HTMLCanvasElement,
    });

    renderer.setSize(
      (canvas as HTMLCanvasElement).width,
      (canvas as HTMLCanvasElement).height,
    ); //window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // console.log(renderer.domElement);

    // background image
    // const backgroundTexture = new THREE.TextureLoader().load(
    //   './space.jpg',
    //   () => {
    //     scene.background = backgroundTexture;
    //   },
    // );
    const backgroundTexture = new THREE.TextureLoader().load('./space.jpg');
    scene.background = backgroundTexture;
    //texture
    let textures: THREE.Texture = new THREE.TextureLoader().load('./earth.jpg');

    // geometry
    let ballGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(
      100,
      64,
      32,
    );
    // material
    let ballMaterial: THREE.MeshPhysicalMaterial =
      new THREE.MeshPhysicalMaterial({
        flatShading: false,
        map: textures,
        // metalness: 0.4,
        // roughness: 0.37,
      });

    // gui.addColor(ballMaterial, 'color');
    // gui.add(ballMaterial, 'metalness').min(0).max(1).step(0.01);
    // gui.add(ballMaterial, 'roughness').min(0).max(1).step(0.01);
    // mesh: combine geometry and material
    let ballMesh: THREE.Mesh = new THREE.Mesh(ballGeometry, ballMaterial);
    // add mesh to scene
    scene.add(ballMesh);
    // parallel light
    directionalLight = new THREE.DirectionalLight(0xffffff, 4);

    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    //ambient light
    let ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);
    // point light
    pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(-200, -200, -200);
    pointLight.decay = 1;

    pointLight.power = 4000;
    // scene.add(pointLight);

    // point light helper
    let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
    // scene.add(pointLightHelper);
    let directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      30,
    );
    scene.add(directionalLightHelper);

    // operate mouse
    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    //point light around the earth
    animate();
  }

  // resize browser
  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    // correct aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
  }

  // Start the animation loop
  function animate() {
    directionalLight.position.set(
      200 * Math.sin(Date.now() / 500),
      200 * Math.sin(Date.now() / 1000),
      200 * Math.cos(Date.now() / 500),
    );
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
};
