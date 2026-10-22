import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as STDLIB from 'three-stdlib';
import envMapUrl from '~/assets/three/envmap/envmap.hdr';
import { createRenderer, disposeDemo, observeResize } from './common';

export async function create({ container, guiContainer, isCancelled }) {
  const envMapTexture = await new STDLIB.RGBELoader().loadAsync(envMapUrl);
  if (isCancelled()) return null;

  // set up the Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FFEECC');

  // set up the Camera
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(-20, 0, 0);

  // set up the WebGL Renderer
  const renderer = createRenderer(container, 'A sphere whose material can be changed in the controls panel');
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  // add Light
  const light = new THREE.PointLight(0xff9845, 12.2, 0, 0.3);
  light.position.set(10, 20, 20);
  scene.add(light);

  // set up Camera Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.dampingFactor = 0.05;
  controls.enableDamping = true;

  /**
   * process environment map
   * source: https://polyhaven.com/hdris
   */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromEquirectangular(envMapTexture).texture;
  envMapTexture.dispose();
  pmrem.dispose();

  const geometry = new THREE.SphereGeometry(5, 10, 10);
  const basicMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });
  const standardMaterial = new THREE.MeshStandardMaterial({
    envMap,
    roughness: 0,
    metalness: 1,
  });
  const sphereMesh = new THREE.Mesh(geometry, basicMaterial);
  scene.add(sphereMesh);

  // standardMaterial.flatShading = true

  // add GUI controls
  const settings = { wireframe: false, flatShading: false, color: `#${basicMaterial.color.getHexString()}` };

  const gui = new GUI({ container: guiContainer });
  gui
    .add(sphereMesh, 'material', { 'Basic Material': basicMaterial, 'Standard Material': standardMaterial })
    .name('Choose Material')
    .onChange((material) => {
      settings.color = `#${material.color.getHexString()}`;
      colorController.updateDisplay();
    });
  gui.add(standardMaterial, 'roughness', 0, 1).name('Roughness');
  gui.add(standardMaterial, 'metalness', 0, 1).name('Metalness');
  gui
    .add(settings, 'wireframe')
    .name('Wireframe')
    .onChange((wireframe) => {
      basicMaterial.wireframe = wireframe;
      standardMaterial.wireframe = wireframe;
    });
  gui
    .add(settings, 'flatShading')
    .name('Flat Shading')
    .onChange((flatShading) => {
      standardMaterial.flatShading = flatShading;
      standardMaterial.needsUpdate = true;
    });
  const colorController = gui
    .addColor(settings, 'color')
    .name('Color')
    .onChange((color) => sphereMesh.material.color.set(color));

  const observer = observeResize(container, camera, renderer);

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    dispose: () => {
      basicMaterial.dispose();
      standardMaterial.dispose();
      envMap.dispose();
      disposeDemo({ renderer, scene, controls, gui, observer });
    },
  };
}
