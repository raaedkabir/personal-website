import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water2.js';
import * as STDLIB from 'three-stdlib';
import { createNoise2D } from 'simplex-noise';
import envMapUrl from '~/assets/three/envmap/envmap.hdr';
import dirtUrl from '~/assets/three/snow-globe/dirt.png';
import grassUrl from '~/assets/three/snow-globe/grass.jpg';
import gravelUrl from '~/assets/three/snow-globe/gravel.jpg';
import sandUrl from '~/assets/three/snow-globe/sand.jpg';
import stoneUrl from '~/assets/three/snow-globe/stone.png';
import waterNormal1Url from '~/assets/three/snow-globe/water-normal-1.jpg';
import waterNormal2Url from '~/assets/three/snow-globe/water-normal-2.jpg';
import { createRenderer, disposeDemo, observeResize, prefersReducedMotion } from './common';

const MAX_HEIGHT = 10;
const STONE_HEIGHT = MAX_HEIGHT * 0.8;
const DIRT_HEIGHT = MAX_HEIGHT * 0.7;
const GRASS_HEIGHT = MAX_HEIGHT * 0.5;
const SAND_HEIGHT = MAX_HEIGHT * 0.3;
const DIRT2_HEIGHT = MAX_HEIGHT * 0;
const SNOW_SIZE = 2;

const hexGeometry = (height, position) => {
  const geo = new THREE.CylinderGeometry(1, 1, height, 6, 1, false);
  geo.translate(position.x, height * 0.5, position.y);

  return geo;
};

const stone = (height, position) => {
  const px = Math.random() * 0.4;
  const pz = Math.random() * 0.4;

  const geo = new THREE.SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
  geo.translate(position.x + px, height, position.y + pz);

  return geo;
};

const tree = (height, position) => {
  const treeHeight = Math.random() * 1 + 1.25;

  const geo = new THREE.CylinderGeometry(0, 1.5, treeHeight, 3);
  geo.translate(position.x, height + treeHeight * 0 + 1, position.y);

  const geo2 = new THREE.CylinderGeometry(0, 1.15, treeHeight, 3);
  geo2.translate(position.x, height + treeHeight * 0.6 + 1, position.y);

  const geo3 = new THREE.CylinderGeometry(0, 0.8, treeHeight, 3);
  geo3.translate(position.x, height + treeHeight * 1.25 + 1, position.y);

  return STDLIB.mergeBufferGeometries([geo, geo2, geo3]);
};

const tileToPosition = (tileX, tileY) => new THREE.Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);

export async function create({ container, isCancelled }) {
  // load textures
  const textureLoader = new THREE.TextureLoader();
  const [envMapTexture, gravel, dirt, grass, sand, stoneTexture, waterNormal1, waterNormal2] = await Promise.all([
    new STDLIB.RGBELoader().loadAsync(envMapUrl),
    ...[gravelUrl, dirtUrl, grassUrl, sandUrl, stoneUrl, waterNormal1Url, waterNormal2Url].map((url) =>
      textureLoader.loadAsync(url),
    ),
  ]);
  if (isCancelled()) return null;

  // set up the Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FFEECC');

  // set up the Camera
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(-17, 50, 60);

  // set up the WebGL Renderer
  const renderer = createRenderer(container, 'A low-poly island of procedurally generated hexagonal tiles inside a glass snow globe');
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  // add Light
  const light = new THREE.PointLight(0xff9845, 12.2, 0, 0.3);
  light.position.set(10, 20, 20);
  light.castShadow = true;
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;
  scene.add(light);

  // set up Camera Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.dampingFactor = 0.05;
  controls.enableDamping = true;

  // process environment map
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromEquirectangular(envMapTexture).texture;
  envMapTexture.dispose();
  pmrem.dispose();

  const textures = { gravel, dirt, grass, sand, stone: stoneTexture };

  let stoneGeo = new THREE.BoxGeometry(0, 0, 0);
  let dirtGeo = new THREE.BoxGeometry(0, 0, 0);
  let dirt2Geo = new THREE.BoxGeometry(0, 0, 0);
  let sandGeo = new THREE.BoxGeometry(0, 0, 0);
  let grassGeo = new THREE.BoxGeometry(0, 0, 0);

  const makeHex = (height, position) => {
    const geo = hexGeometry(height, position);

    if (height > STONE_HEIGHT) {
      stoneGeo = STDLIB.mergeBufferGeometries([geo, stoneGeo]);

      // randomly spawn a new stone
      if (Math.random() > 0.8) stoneGeo = STDLIB.mergeBufferGeometries([stoneGeo, stone(height, position)]);
    } else if (height > DIRT_HEIGHT) {
      dirtGeo = STDLIB.mergeBufferGeometries([geo, dirtGeo]);

      // randonly spawn a tree
      if (Math.random() > 0.8) grassGeo = STDLIB.mergeBufferGeometries([grassGeo, tree(height, position)]);
    } else if (height > GRASS_HEIGHT) {
      grassGeo = STDLIB.mergeBufferGeometries([geo, grassGeo]);
    } else if (height > SAND_HEIGHT) {
      sandGeo = STDLIB.mergeBufferGeometries([geo, sandGeo]);

      // randomly spawn a new stone
      if (Math.random() > 0.8) stoneGeo = STDLIB.mergeBufferGeometries([stoneGeo, stone(height, position)]);
    } else if (height > DIRT2_HEIGHT) {
      dirt2Geo = STDLIB.mergeBufferGeometries([geo, dirt2Geo]);
    }
  };

  // TODO: clean-up
  const hexMesh = (geo, map) => {
    const mat = new THREE.MeshPhysicalMaterial({
      envMap,
      envMapIntensity: 0.135,
      flatShading: true,
      map,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  };

  const clouds = () => {
    let geo = new THREE.SphereGeometry(0, 0, 0);
    const count = Math.floor(Math.pow(Math.random(), 0.45) * 4);

    for (let i = 0; i < count; i++) {
      const puff1 = new THREE.SphereGeometry(1.2, 7, 7);
      const puff2 = new THREE.SphereGeometry(1.5, 7, 7);
      const puff3 = new THREE.SphereGeometry(0.9, 7, 7);

      puff1.translate(-1.85, Math.random() * 0.3, 0);
      puff2.translate(0, Math.random() * 0.3, 0);
      puff3.translate(1.85, Math.random() * 0.3, 0);

      const cloudGeo = STDLIB.mergeBufferGeometries([puff1, puff2, puff3]);
      cloudGeo.translate(Math.random() * 20 - 10, Math.random() * 7 + 7, Math.random() * 20 - 10);
      cloudGeo.rotateY(Math.random() * Math.PI * 2);

      geo = STDLIB.mergeBufferGeometries([geo, cloudGeo]);
    }

    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        envMap,
        envMapIntensity: 0.75,
        flatShading: true,
        // transparent: true,
        // opacity: 0.85,
      }),
    );

    scene.add(mesh);
  };

  // create hexagons
  const noise2D = createNoise2D();

  for (let i = -10; i <= 10; i++) {
    for (let j = -10; j <= 10; j++) {
      const position = tileToPosition(i, j);

      if (position.length() > 16) continue;

      let noise = (noise2D(i * 0.1, j * 0.1) + 1) * 0.5;
      noise = Math.pow(noise, 1.5);

      makeHex(noise * MAX_HEIGHT, position);
    }
  }

  const stoneMesh = hexMesh(stoneGeo, textures.stone);
  const grassMesh = hexMesh(grassGeo, textures.grass);
  const dirt2Mesh = hexMesh(dirt2Geo, textures.gravel);
  const dirtMesh = hexMesh(dirtGeo, textures.dirt);
  const sandMesh = hexMesh(sandGeo, textures.sand);
  scene.add(stoneMesh, dirtMesh, dirt2Mesh, sandMesh, grassMesh);

  // create water

  // const seaMesh = new THREE.Mesh(
  //   new THREE.CylinderGeometry(17, 17, MAX_HEIGHT * .2, 50),
  //   new THREE.MeshPhysicalMaterial({
  //     envMap,
  //     color: new THREE.Color('#55aaff').convertSRGBToLinear().multiplyScalar(3),
  //     ior: 1.325,
  //     transmission: 1,
  //     transparent: true,
  //     thickness: 1.5,
  //     envMapIntensity:.2,
  //     roughness: 1,
  //     metalness: .025,
  //     roughnessMap: textures.water,
  //     metalnessMap: textures.water
  //   })
  // )
  // seaMesh.receiveShadow = true
  // seaMesh.position.set(0, MAX_HEIGHT * .1, 0)
  // scene.add(seaMesh)

  // Water2 otherwise loads its normal maps relative to the page URL
  const water = new Water(new THREE.CircleGeometry(17, 50), {
    color: new THREE.Color('#55aaff').multiplyScalar(3),
    flowSpeed: 0.04,
    flowDirection: new THREE.Vector2(0, 0),
    normalMap0: waterNormal1,
    normalMap1: waterNormal2,
    // flowMap
  });
  water.receiveShadow = true;
  water.position.set(0, MAX_HEIGHT * 0.2, 0);
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // create walls
  const wallMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(17.1, 17.1, MAX_HEIGHT * 0.25, 50, 1, true),
    new THREE.MeshPhysicalMaterial({
      envMap,
      map: textures.dirt,
      envMapIntensity: 0.2,
      side: THREE.DoubleSide,
    }),
  );
  wallMesh.receiveShadow = true;
  wallMesh.position.set(0, MAX_HEIGHT * 0.125, 0);
  scene.add(wallMesh);

  // create floor
  const floorMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(18.5, 18.5, MAX_HEIGHT * 0.1, 50),
    new THREE.MeshPhysicalMaterial({
      envMap,
      map: textures.gravel,
      envMapIntensity: 0.1,
      side: THREE.DoubleSide,
    }),
  );
  floorMesh.receiveShadow = true;
  floorMesh.position.set(0, -MAX_HEIGHT * 0.05, 0);
  scene.add(floorMesh);

  // add clouds
  clouds();

  // create glass dome
  const phiStart = 0;
  const phiEnd = Math.PI * 2;
  const thetaStart = 0;
  const thetaEnd = Math.PI / 2;

  const sphereGeometry = new THREE.SphereGeometry(18.5, 32, 16, phiStart, phiEnd, thetaStart, thetaEnd);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    metalness: 0,
    color: new THREE.Color().setHex(0x89cff0, THREE.LinearSRGBColorSpace),
    transmission: 1,
    transparent: true,
    opacity: 0.3,
    ior: 1.5,
    side: THREE.DoubleSide,
    depthWrite: false,
    // envMap
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);

  // add Snow Particles
  const particleNum = 10000;
  const maxRange = 1000;
  const minRange = maxRange / 2;
  const textureSize = 64.0;

  const drawRadialGradation = (ctx, canvasRadius, canvasW, canvasH) => {
    ctx.save();
    const gradient = ctx.createRadialGradient(canvasRadius, canvasRadius, 0, canvasRadius, canvasRadius, canvasRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.restore();
  };

  const getTextureMap = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const diameter = textureSize;
    canvas.width = diameter;
    canvas.height = diameter;
    const canvasRadius = diameter / 2;

    drawRadialGradation(ctx, canvasRadius, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    // texture.minFilter = THREE.NearestFilter
    return texture;
  };

  const pointGeometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < particleNum; i++) {
    const x = Math.floor(Math.random() * maxRange - minRange);
    const y = Math.floor(Math.random() * maxRange - minRange);
    const z = Math.floor(Math.random() * maxRange - minRange);
    vertices.push(x, y, z);
  }
  pointGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

  const pointMaterial = new THREE.PointsMaterial({
    size: SNOW_SIZE,
    color: 0xff0000,
    vertexColors: false,
    map: getTextureMap(),
    // blending: THREE.AdditiveBlending,
    transparent: true,
    // opacity: 0.8,
    fog: true,
    depthWrite: false,
  });

  const velocities = [];
  for (let i = 0; i < particleNum; i++) {
    const x = Math.floor(Math.random() * 6 - 3) * 0.1;
    const y = Math.floor(Math.random() * 10 + 3) * -0.05;
    const z = Math.floor(Math.random() * 6 - 3) * 0.1;
    velocities.push(new THREE.Vector3(x, y, z));
  }

  const particles = new THREE.Points(pointGeometry, pointMaterial);
  particles.layers.set(1);
  camera.layers.enable(1);
  scene.add(particles);

  const observer = observeResize(container, camera, renderer);
  const animateSnow = !prefersReducedMotion();

  // done rendering
  renderer.setAnimationLoop((timeStamp) => {
    controls.update();
    renderer.render(scene, camera);

    if (!animateSnow) return;

    // update
    const positionAttribute = pointGeometry.getAttribute('position');

    for (let i = 0; i < positionAttribute.count; i++) {
      const velocity = velocities[i];

      const velX = Math.sin(timeStamp * 0.001 * velocity.x) * 0.1;
      const velZ = Math.cos(timeStamp * 0.0015 * velocity.z) * 0.1;

      const x = positionAttribute.getX(i) + velX;
      let y = positionAttribute.getY(i) + velocity.y;
      const z = positionAttribute.getZ(i) + velZ;
      if (y < -minRange) {
        y = minRange;
      }

      positionAttribute.setXYZ(i, x, y, z);
    }

    positionAttribute.needsUpdate = true;
  });

  return {
    dispose: () => disposeDemo({ renderer, scene, controls, observer }),
  };
}
