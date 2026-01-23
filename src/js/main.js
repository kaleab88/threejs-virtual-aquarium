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

function animateFish(fish, time) {
  const data = fish.userData;

  const swimSpeed = 4;
  const wave = Math.sin(time * swimSpeed + data.swimOffset);

  // Tail swing (primary motion)
  data.tail.rotation.y = wave * 0.6;

  // Body subtle wave
  data.body.rotation.z = wave * 0.05;

  // Fin flutter
  data.fins.forEach((fin, i) => {
    fin.rotation.z = Math.sin(time * 6 + i) * 0.15;
  });
}

function avoidCollisions(fish, allFish) {
  const data = fish.userData;
  const minDistance = 0.5; // how close before repelling

  allFish.forEach(other => {
    if (other === fish) return;

    const dist = fish.position.distanceTo(other.position);
    if (dist < minDistance) {
      // Push fish away from each other
      const away = new THREE.Vector3().subVectors(fish.position, other.position).normalize();
      data.velocity.addScaledVector(away, 0.01);
    }
  });
}

function avoidObstacle(fish, obstacleMesh) {
  const data = fish.userData;

  const fishBox = new THREE.Box3().setFromObject(fish);
  const obstacleBox = new THREE.Box3().setFromObject(obstacleMesh);

  if (fishBox.intersectsBox(obstacleBox)) {
    // Compute direction away from obstacle
    const away = new THREE.Vector3().subVectors(fish.position, obstacleMesh.position).normalize();

    // Preserve current speed but redirect direction
    const currentSpeed = data.velocity.length() || 0.02; // ensure non-zero speed
    data.velocity.copy(away.multiplyScalar(currentSpeed));

    // ✅ Optional escape logic: nudge fish outside obstacle
    fish.position.add(away.multiplyScalar(0.1));
  }
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

const middleBox = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x888888 })
);
scene.add(middleBox);

const clock = new THREE.Clock();

const fishGroup = new THREE.Group();

const fish1 = createFish({ color: 0x4da6ff, scale: 1 });
fish1.position.set(-3, 0, 0); 

const fish2 = createFish({ color: 0xffcc00, scale: 0.8 });
fish2.position.set(2, 1, -1); 

const fish3 = createFish({ color: 0x00ffff, scale: 0.9 });
fish3.position.set(1, -1, 2); 


fishGroup.add(fish1, fish2, fish3);
scene.add(fishGroup);

fishGroup.children.forEach(fish => {
fish.traverse(child => {
if (child.isMesh) child.userData.selectable = true;
});
avoidCollisions(fish, fishGroup.children);
avoidObstacle(fish, middleBox);
});

// Coral palette and helper
const coralColors = [0xff6666, 0xff9966, 0xcc66ff, 0xffcc66, 0xff7f50, 0xf4a460];

function makeCoralMaterial() {
  return new THREE.MeshStandardMaterial({
    color: coralColors[Math.floor(Math.random() * coralColors.length)],
    roughness: 0.8,
    metalness: 0.1
  });
}



function createAquariumFloor() {
  const geometry = new THREE.PlaneGeometry(
    AQUARIUM.width,
    AQUARIUM.depth
  );

  // We use MeshStandardMaterial with a 'color' instead of a 'map'
  const material = new THREE.MeshStandardMaterial({
    color: 0xd2b48c,  // A warm, sandy tan hex color
    roughness: 1.0,    // Perfectly matte (like sand)
    metalness: 0.0     // No metallic reflection
  });

  const floor = new THREE.Mesh(geometry, material);

  // Rotate so it lies flat
  floor.rotation.x = -Math.PI / 2;

  // Position at the bottom of the aquarium
  floor.position.y = -AQUARIUM.height / 2;

  // This ensures the floor can receive shadows from the sun we are about to add
  floor.receiveShadow = true;

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
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5; // slow orbit
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
  const ambientLight = new THREE.AmbientLight(0x446688, 0.8);
  scene.add(ambientLight);

  const topLight = new THREE.DirectionalLight(0x88ccee, 1.1);
  topLight.position.set(0, 10, 0);
  scene.add(topLight);
  window.aquariumLight = topLight;


  const sideLight = new THREE.DirectionalLight(0x336699, 0.6);
  sideLight.position.set(-5, 3, 2);
  scene.add(sideLight);
}

addBasicLights();

// 5.2.1 Create the Sunlight
const sunLight = new THREE.DirectionalLight(0xffffff,0.5);
sunLight.position.set(0, 10, 0); // Directly above the tank
scene.add(sunLight);

// 5.2.2 Set the Target to the center of the tank
sunLight.target.position.set(0, 0, 0);
scene.add(sunLight.target);

// 5.2.3 Optional: Enable shadows if your hardware can handle it
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;

const waterAmbient = new THREE.AmbientLight(0x1e4fd8, 0.6);

// Color: A pale, sky blue (0x88aaff) to contrast with the deep blue ambient
// Intensity: 1.2
const sideFill = new THREE.DirectionalLight(0x88aaff, 1.2);

// Position it to the side (5), above (5), and slightly in front (2)
sideFill.position.set(5, 5, 2); 

// Add it to the scene
scene.add(sideFill);
scene.add(waterAmbient);



function createAquariumWalls() {
  // We upgrade to MeshPhysicalMaterial for realistic glass/water effects
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x00aaff,      // A slightly brighter, tropical water blue
    transparent: true,
    opacity: 0.15,        // Lowered from 0.3 to let your new lights shine through
    
    // Physical properties
    transmission: 0.9,    // This makes it look like clear glass/water
    roughness: 0.05,      // Very smooth surface for sharp highlights
    thickness: 0.5,       // Simulates the thickness of the glass
    
    // Your existing important settings
    side: THREE.DoubleSide,
    depthWrite: false     // Keeps the transparency sorting stable
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

decorGroup.add(createRock(new THREE.Vector3(-3, -2.5, 1)));
decorGroup.add(createRock(new THREE.Vector3(3, -2.5, -2)));
decorGroup.add(createCoral(new THREE.Vector3(0, -2.6, -1)));

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
  const data = fish.userData;
  const pos = fish.position;

  // ✅ True color from userData.baseColor
  const colorHex = data.baseColor.toString(16).padStart(6, '0');

  // ✅ Actual speed from velocity magnitude
  const actualSpeed = data.velocity ? data.velocity.length() : 0;

  document.getElementById('fish-name').textContent = `Fish #${fish.id}`;
  document.getElementById('fish-color').textContent = colorHex;
  document.getElementById('fish-speed').textContent = actualSpeed.toFixed(3);

  const posEl = document.getElementById('fish-position');
  if (posEl) {
    posEl.textContent = `(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`;
  }

  document.getElementById('info-panel').classList.remove('hidden');
}


function selectFish(fish) {
clearSelection();
selectedFish = fish;


updateInfoPanel(fish);
}


function clearSelection() {
if (!selectedFish) return;


selectedFish = null;
document.getElementById('info-panel').classList.add('hidden');
}


function attachBubbleTrail(fish, scene, AQUARIUM) {
  if (Math.random() < 0.02) {
    const bubbles = createBubbles(scene, 1, AQUARIUM);
    const bubble = bubbles[0];
    bubble.position.copy(fish.position);

    // Add to global array so startLoop animates it
    if (!window.bubbles) window.bubbles = [];
    window.bubbles.push(bubble);
  }
}



function updateAllFish(delta) {
  fishGroup.children.forEach(fish => {
    updateFish(fish, delta);

    // Check collisions with middle box
    avoidObstacle(fish, middleBox);

    // Check collisions with decor (rocks, corals)
    decorGroup.children.forEach(obstacle => {
      avoidObstacle(fish, obstacle);
    });
    // Bubble trail 
    attachBubbleTrail(fish, scene, AQUARIUM);
  });
}


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
    const delta = clock.getDelta();
    updateAllFish(delta);

    // Animate fish swimming motion
    const time = performance.now() * 0.001;
    fishGroup.children.forEach(fish => animateFish(fish, time));

    controls.update();
    // Light shimmer effect
window.aquariumLight.intensity = 1 + Math.sin(performance.now() * 0.001) * 0.1;

});


// function animate() {
//   requestAnimationFrame(animate);

//   fishGroup.children.forEach(updateFish);

//   controls.update();
//   renderer.render(scene, camera);
// }

// animate();