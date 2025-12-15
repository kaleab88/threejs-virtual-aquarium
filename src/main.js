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
const camera = createCamera();
const renderer = createRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
scene.add(cube);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

setupResize(camera, renderer);
startLoop(renderer, scene, camera, () => controls.update());