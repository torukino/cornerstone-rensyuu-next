import GUI from 'lil-gui';
import * as THREE from 'three';

export const homeThree = (canvas) => {
  console.log('homeThree');

  //gui
  const gui = new GUI();
  if (!gui) return;
  // get canvas

  if (!canvas) return ;

  // basic 3 elements
  // scene
  const scene = new THREE.Scene();
  // size
  const sizes = {
    height: window.innerHeight,
    width: window.innerWidth,
  };
  //camera
  const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.z = 10;
  scene.add(camera);
  //renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  // make objects
  // material

  const material = new THREE.MeshPhysicalMaterial({
    color: '#3c94d7',
    flatShading: true,
    metalness: 0.87,
    roughness: 0.37,
  });

  gui.addColor(material, 'color');
  gui.add(material, 'metalness').min(0).max(1).step(0.01);
  gui.add(material, 'roughness').min(0).max(1).step(0.01);
  //mesh

  const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material,
  );
  const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
  const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material,
  );
  const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

  //　配置
  mesh1.position.set(2, 0, 0);
  mesh2.position.set(-1, 0, 0);
  mesh3.position.set(2, 0, -6);
  mesh4.position.set(5, 0, 3);

  scene.add(mesh1, mesh2, mesh3, mesh4);
  const meshes = [mesh1, mesh2, mesh3, mesh4];
  // add particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 700;
  const positionArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionArray, 3),
  );

  //material
  const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffffff',
    size: 0.025,
  });

  //mesh
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // light
  const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
  directionalLight.position.set(0.5, 1, 0);
  scene.add(directionalLight);

  // brawser resize
  window.addEventListener('resize', () => {
    // update size
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  const clock = new THREE.Clock();
  // wheel
  let speed = 0;
  let rotation = 0;
  window.addEventListener('wheel', (event) => {
    speed += event.deltaY * 0.0002;
  });

  function rot() {
    rotation += speed;
    speed *= 0.93;

    //rotate all geometry

    mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
    mesh1.position.z = 2 + 3.8 * Math.sin(rotation);

    mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
    mesh2.position.z = 2 + 3.8 * Math.sin(rotation + Math.PI / 2);

    mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
    mesh3.position.z = 2 + 3.8 * Math.sin(rotation + Math.PI);

    mesh4.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI * 1.5);
    mesh4.position.z = 2 + 3.8 * Math.sin(rotation + Math.PI * 1.5);

    window.requestAnimationFrame(rot);
  }

  rot();

  // get location of cursor
  const cursor = {};
  cursor.x = 0;
  cursor.y = 0;

  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
  });

  const animate = () => {
    renderer.render(scene, camera);

    let getDeltaTime = clock.getDelta();
    //rotate mesh
    for (const mesh of meshes) {
      mesh.rotation.x += 1 * getDeltaTime;
      mesh.rotation.y += 1 * getDeltaTime;
    }

    // control camera
    // camera.position.x += cursor.x * getDeltaTime * 2;
    // camera.position.y += -cursor.y * getDeltaTime * 2;

    window.requestAnimationFrame(animate);
  };

  animate();
};
