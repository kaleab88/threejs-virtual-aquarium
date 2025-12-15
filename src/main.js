import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { startLoop } from "./core/loop.js";
import { setupResize } from "./utils/resize.js";

// Aquarium dimensions (world units)
const AQUARIUM = {
  width: 10,
  height: 6,
  depth: 6,
  wallThickness: 0.1
};

const scene = createScene();

function createAquariumFloor() {
  const geometry = new THREE.PlaneGeometry(
    AQUARIUM.width,
    AQUARIUM.depth
  );

  const material = new THREE.MeshStandardMaterial({
    color: 0x2e8b57, // muted green
    roughness: 0.9,
    metalness: 0.0
  });

  const floor = new THREE.Mesh(geometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -AQUARIUM.height / 2;

  return floor;
}

const camera = createCamera();
const renderer = createRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
scene.add(cube);

const floor = createAquariumFloor();
scene.add(floor);

function addBasicLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 10, 5);
  scene.add(directional);
}

addBasicLights();

setupResize(camera, renderer);
startLoop(renderer, scene, camera, () => controls.update());