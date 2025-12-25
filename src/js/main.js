// ============================= // Imports // =============================

import * as THREE from "../../lib/three.module.js";
import { OrbitControls } from "../../lib/OrbitControls.js";
import { createScene } from "../core/scene.js";
import { createCamera } from "../core/camera.js";
import { createRenderer } from "../core/renderer.js";
import { startLoop } from "../core/loop.js";
import { setupResize } from "../utils/resize.js";
import { createFish } from './fishFactory.js';
import { createRock, createCoral } from './decorFactory.js';
import { createBubbles} from "./effects.js"


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedFish = null;

function updateFish(fish, delta) {
  const speedMultiplier = 50;
  fish.position.addScaledVector(fish.userData.velocity, delta * speedMultiplier);

  const halfW = AQUARIUM.width / 2;
  const halfH = AQUARIUM.height / 2;
  const halfD = AQUARIUM.depth / 2;

  // Estimate fish half-size (adjust if needed)
  const margin = 0.5; // half the fish body length

  const minY = -halfH + margin;
  const maxY = halfH - margin;

  if (fish.position.y < minY) {
    fish.position.y = minY;
    fish.userData.velocity.y *= -1;
  }
  if (fish.position.y > maxY) {
    fish.position.y = maxY;
    fish.userData.velocity.y *= -1;
  }

  if (fish.position.x > halfW - margin) {
    fish.position.x = halfW - margin;
    fish.userData.velocity.x *= -1;
  }
  if (fish.position.x < -halfW + margin) {
    fish.position.x = -halfW + margin;
    fish.userData.velocity.x *= -1;
  }

  if (fish.position.z > halfD - margin) {
    fish.position.z = halfD - margin;
    fish.userData.velocity.z *= -1;
  }
  if (fish.position.z < -halfD + margin) {
    fish.position.z = -halfD + margin;
    fish.userData.velocity.z *= -1;
  }

  // Smooth rotation
  const dir = fish.userData.velocity.clone().normalize();
  const targetAngle = Math.atan2(-dir.z, dir.x);
  fish.rotation.y += (targetAngle - fish.rotation.y) * 0.1;
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

const clock = new THREE.Clock();

const fishGroup = new THREE.Group();

const fish1 = createFish({ color: 0x4da6ff, scale: 1 });
fish1.position.set(0, 0, 0);

const fish2 = createFish({ color: 0xffcc00, scale: 0.8 });
fish2.position.set(2, 1, -1);

fishGroup.add(fish1, fish2);
scene.add(fishGroup);

fishGroup.children.forEach(fish => {
fish.traverse(child => {
if (child.isMesh) child.userData.selectable = true;
});
});



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

// Renderer performance & color management
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;



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
  const ambientLight = new THREE.AmbientLight(0x1e3a5f, 0.4);
  scene.add(ambientLight);

  const topLight = new THREE.DirectionalLight(0x88ccee, 1.0);
  topLight.position.set(0, 10, 0);
  scene.add(topLight);
  window.aquariumLight = topLight;


  const sideLight = new THREE.DirectionalLight(0x336699, 0.3);
  sideLight.position.set(-5, 3, 2);
  scene.add(sideLight);
}

addBasicLights();


function createAquariumWalls() {
  const material = new THREE.MeshStandardMaterial({
    color: 0x1e90ff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false // IMPORTANT: do not write to depth, prevents occlusion
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
  front.renderOrder = 0; // draw early

  const back = front.clone();
  back.position.z = -AQUARIUM.depth / 2;
  back.rotation.y = Math.PI;
  back.renderOrder = 0;

  // Left & Right
  const lrGeometry = new THREE.PlaneGeometry(
    AQUARIUM.depth,
    AQUARIUM.height
  );

  const left = new THREE.Mesh(lrGeometry, material);
  left.position.x = -AQUARIUM.width / 2;
  left.rotation.y = Math.PI / 2;
  left.renderOrder = 0;

  const right = left.clone();
  right.position.x = AQUARIUM.width / 2;
  right.rotation.y = -Math.PI / 2;
  right.renderOrder = 0;

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

const bubbles = createBubbles(scene, 20, AQUARIUM);
window.bubbles = bubbles;
window.AQUARIUM = AQUARIUM;

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(fishGroup.children, true);

  if (intersects.length > 0) {
    selectFish(intersects[0].object.parent);
  } else {
    clearSelection();
  }
});

function updateInfoPanel(fish) {
document.getElementById('fish-name').textContent = 'Fish';
document.getElementById('fish-color').textContent = fish.children[0].material.color.getHexString();
document.getElementById('fish-speed').textContent = fish.userData.speed.toFixed(2);


document.getElementById('info-panel').classList.remove('hidden');
}

function selectFish(fish) {
clearSelection();
selectedFish = fish;


fish.traverse(child => {
if (child.isMesh) child.material.emissive.setHex(0x333333);
});


updateInfoPanel(fish);
}


function clearSelection() {
if (!selectedFish) return;


selectedFish.traverse(child => {
if (child.isMesh) child.material.emissive.setHex(0x000000);
});


selectedFish = null;
document.getElementById('info-panel').classList.add('hidden');
}
function updateAllFish(delta) { fishGroup.children.forEach(fish => updateFish(fish, delta)); }

let lastTime = performance.now();
let frames = 0;

function showFPS() {
  frames++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    console.log("FPS:", frames);
    frames = 0;
    lastTime = now;
  }
}





startLoop(renderer, scene, camera, () => { 
    updateAllFish(clock.getDelta()); // fish still use delta 
    // updateBubbles(bubbles, AQUARIUM); // bubbles use fixed increment 
    controls.update();
   });

// function animate() {
//   requestAnimationFrame(animate);

//   fishGroup.children.forEach(updateFish);

//   controls.update();
//   renderer.render(scene, camera);
// }

// animate();