import * as THREE from "../../lib/three.module.js";
import { OrbitControls } from "../../lib/OrbitControls.js";
import { createScene } from "../core/scene.js";
import { createCamera } from "../core/camera.js";
import { createRenderer } from "../core/renderer.js";
import { startLoop } from "../core/loop.js";
import { setupResize } from "../utils/resize.js";
import { createFish } from './fishFactory.js';
import { createRock, createCoral } from './decorFactory.js';

function updateFish(fish) {
  fish.position.add(fish.userData.velocity);

  const halfW = AQUARIUM.width / 2;
  const halfH = AQUARIUM.height / 2;
  const halfD = AQUARIUM.depth / 2;

  ['x', 'y', 'z'].forEach(axis => {
    if (fish.position[axis] > (axis === 'y' ? halfH : axis === 'x' ? halfW : halfD) ||
        fish.position[axis] < -(axis === 'y' ? halfH : axis === 'x' ? halfW : halfD)) {
      fish.userData.velocity[axis] *= -1;
    }
  });

  const dir = fish.userData.velocity.clone().normalize();
  fish.rotation.y = Math.atan2(-dir.z, dir.x);
}

console.log('Main script loaded');

// Aquarium dimensions (world units)
const AQUARIUM = {
  width: 10,
  height: 6,
  depth: 6,
  wallThickness: 0.1
};

const scene = createScene();

const fishGroup = new THREE.Group();

const fish1 = createFish({ color: 0x4da6ff, scale: 1 });
fish1.position.set(0, 0, 0);

const fish2 = createFish({ color: 0xffcc00, scale: 0.8 });
fish2.position.set(2, 1, -1);

fishGroup.add(fish1, fish2);
scene.add(fishGroup);

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
camera.position.set(0, 3, 12);
controls.target.set(0, 0, 0);
controls.update();

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

function createAquariumWalls() {
  const material = new THREE.MeshStandardMaterial({
    color: 0x1e90ff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  const walls = [];

  // Front & Back
  const fbGeometry = new THREE.PlaneGeometry(
    AQUARIUM.width,
    AQUARIUM.height
  );

  const front = new THREE.Mesh(fbGeometry, material);
  front.position.z = AQUARIUM.depth / 2;
  front.position.y = 0;

  const back = front.clone();
  back.position.z = -AQUARIUM.depth / 2;
  back.rotation.y = Math.PI;

  // Left & Right
  const lrGeometry = new THREE.PlaneGeometry(
    AQUARIUM.depth,
    AQUARIUM.height
  );

  const left = new THREE.Mesh(lrGeometry, material);
  left.position.x = -AQUARIUM.width / 2;
  left.rotation.y = Math.PI / 2;

  const right = left.clone();
  right.position.x = AQUARIUM.width / 2;
  right.rotation.y = -Math.PI / 2;

  walls.push(front, back, left, right);
  return walls;
}

const walls = createAquariumWalls();
walls.forEach(wall => scene.add(wall));

const decorGroup = new THREE.Group();

decorGroup.add(createRock(new THREE.Vector3(-3, -2.8, 1)));
decorGroup.add(createRock(new THREE.Vector3(3, -2.8, -2)));
decorGroup.add(createCoral(new THREE.Vector3(0, -2.8, -3)));

scene.add(decorGroup);

setupResize(camera, renderer);

function animate() {
  requestAnimationFrame(animate);

  fishGroup.children.forEach(updateFish);

  controls.update();
  renderer.render(scene, camera);
}

animate();