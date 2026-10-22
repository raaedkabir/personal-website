import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import lighthouseUrl from '~/assets/three/lighthouse/lighthouse.gltf';
import { createRenderer, disposeDemo, observeResize, prefersReducedMotion } from './common';

export async function create({ container, isCancelled }) {
  // load the model
  const gltf = await new GLTFLoader().loadAsync(lighthouseUrl);
  if (isCancelled()) return null;

  // setup lights
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x4b9dff);
  const light = new THREE.AmbientLight(0xffffff, Math.PI);
  scene.add(light);

  // setup the camera
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 10000);
  camera.position.set(-36, 8, -38);
  camera.lookAt(0, 0, 0);

  scene.add(gltf.scene);

  // setup the renderer
  const renderer = createRenderer(container, 'A red and white lighthouse and a few cottages on a small rocky island');

  // setup the camera
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI * 0.4;
  controls.autoRotate = !prefersReducedMotion();
  controls.autoRotateSpeed = 0.25;
  controls.minDistance = 10;
  controls.maxDistance = 60;
  controls.enablePan = false;

  const observer = observeResize(container, camera, renderer);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    dispose: () => disposeDemo({ renderer, scene, controls, observer }),
  };
}
