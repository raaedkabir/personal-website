import * as THREE from 'three';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const createRenderer = (container, label) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', label);
  container.appendChild(renderer.domElement);
  return renderer;
};

export const observeResize = (container, camera, renderer) => {
  const observer = new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = container;
    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  observer.observe(container);
  return observer;
};

const disposeMaterial = (material) => {
  const uniforms = Object.values(material.uniforms ?? {}).map(({ value }) => value);
  for (const value of [...Object.values(material), ...uniforms]) {
    if (value?.isTexture) value.dispose();
  }
  material.dispose();
};

export const disposeDemo = ({ renderer, scene, controls, gui, observer }) => {
  renderer.setAnimationLoop(null);
  observer.disconnect();
  controls.dispose();
  gui?.destroy();
  scene.traverse((object) => {
    object.geometry?.dispose();
    [object.material].flat().filter(Boolean).forEach(disposeMaterial);
  });
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.domElement.remove();
};
