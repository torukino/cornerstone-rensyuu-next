import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let pointLight: THREE.PointLight;
let controls: OrbitControls;

export const earthThreeRyo = (canvas: HTMLElement) => {
  console.log('earthThreeRyo was rendered');

  // 1. scene を設定
  scene = new THREE.Scene();

  // 2. camera を設定
  camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    1,
    10000,
  );
  camera.position.set(0, 0, +500);

  // 3. renderer を設定
  const renderer = new THREE.WebGLRenderer({
    // alphaの設定 alpha: true にすると背景が透明になる
    alpha: true,
    canvas: canvas as HTMLCanvasElement,
  });

  // ぎざぎざをなくす
  renderer.setPixelRatio(window.devicePixelRatio);

  // ball geometry (形) を設定
  // 背景を加える space.jpg
  // background image
  const backgroundTexture = new THREE.TextureLoader().load('./space.jpg');
  scene.background = backgroundTexture;

  // ちきゅうのテクスチャーを加える
  // texture
  const textures: THREE.Texture = new THREE.TextureLoader().load('./earth.jpg');
  let ballGeometry = new THREE.SphereGeometry(100, 64, 64);

  // ball material (素材) を設定
  let ballMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial(
    {
      flatShading: true,
      map: textures,
    },
  );

  // 4. ball mesh を設定
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);

  // 5. ball mesh を scene に追加
  scene.add(ballMesh);

  // 6. umbient light を設定
  let ambientLight = new THREE.AmbientLight(0xffffff);

  // point light を設定
  pointLight = new THREE.PointLight(0xffffff, 2, 1000);
  //   decay は光の減衰率
  pointLight.decay = 1;
  // power は光の強さ
  pointLight.power = 12000;
  pointLight.position.set(400, 400, 400);

  // 7. ambient light を scene に追加
  //   scene.add(ambientLight);
  // 8. point light を scene に追加
  scene.add(pointLight);

  // point light helperの設定
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
  //   ここにmoon.pngを加える
    
  scene.add(pointLightHelper);

  // 最後: renderer を設定
  renderer.render(scene, camera);

  function animate() {
    pointLight.position.set(
      200 * Math.sin(Date.now() / 500),
      200 * Math.sin(Date.now() / 1000),
      200 * Math.cos(Date.now() / 500),
    );
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  // controls を設定
  controls = new OrbitControls(camera, renderer.domElement);
  // resize を設定
  window.addEventListener('resize', onWindowResize);

  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    // correct aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
  }
};
