import * as THREE from 'three';

export const earth = (canvas) => {
  // make scene
  scene = new THREE.Scene();
  if(!scene) return;
  // make camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  // make renderer
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  canvas.appendChild(renderer.domElement);

  // add texture
  let textures = new THREE.TextureLoader().load('./earth.jpg');
  //make geometry
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32);
  // make material
  let ballMaterial = new THREE.MeshPhysicalMaterial({ map: textures });
  //make mesh
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  //add mesh to scene
  scene.add(ballMesh);
  // add light
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  // point light
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(50, 50, 50);
  pointLight.decay = 1;
  pointLight.power = 2000;
  scene.add(pointLight);

  // point light helper
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);
  // mouse controls
  controls = new OrbitControls(camera, renderer.domElement);
  animate();
  //set camera position
  camera.position.set(0, 0, 500);
  renderer.render(scene, camera);
  window.addEventListener('resize', onWindowResize);
};

// resize window
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  // correct cameera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// move point light around ball
function animate() {
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500),
  );
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
