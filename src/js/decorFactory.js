import * as THREE from '../../lib/three.module.js';

// Coral palette used for both rocks and coral for a cohesive seabed look
const coralColors = [0xff6666, 0xff9966, 0xcc66ff, 0xffcc66, 0xff7f50, 0xf4a460];
const textureLoader = new THREE.TextureLoader();

function randomCoralColor() {
  return coralColors[Math.floor(Math.random() * coralColors.length)];
}

export function createRock(position) {
  const geometry = new THREE.IcosahedronGeometry(0.5, 0);

  // 1. Load the rock texture
  const rockTexture = textureLoader.load('public/textures/rock.png');
  
  // 2. Set wrapping and repeat for natural detail
  rockTexture.wrapS = rockTexture.wrapT = THREE.RepeatWrapping;
  rockTexture.repeat.set(1.5, 1.5); // Lower repeat makes details larger/more jagged

  // 3. Create material: Remove the random color and let the texture lead
  const material = new THREE.MeshStandardMaterial({
    map: rockTexture,
    color: 0xffffff, // Set to white so the texture colors show exactly as they are
    roughness: 0.9,  // High roughness for a non-shiny stone look
    metalness: 0.05
  });

  const rock = new THREE.Mesh(geometry, material);
  rock.position.copy(position);
  
  // 4. Shadows make the rocks feel "heavy" on the sand
  rock.castShadow = true;
  rock.receiveShadow = true;

  return rock;
}

export function createCoral(position, color = null) {
  const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8);

  const material = new THREE.MeshStandardMaterial({
    color: color ?? randomCoralColor(),
    roughness: 0.9,
    metalness: 0.05
  });

  const coral = new THREE.Mesh(geometry, material);
  coral.position.copy(position);
  return coral;
}

/**
 * Creates a procedural seaweed stalk
 */
export function createSeaweed(position) {
  // Radius: 0.1 at bottom, 0 at top (sharp point). 
  // Height: 1.4. 
  // RadialSegments: 3 (makes it look flat/bladed rather than round).
  // HeightSegments: 20 (essential for smooth bending).
  const geometry = new THREE.ConeGeometry(0.1, 1.2, 3, 20);
  
  // Pivot point: Move base to 0,0,0
  geometry.translate(0, 0.7, 0); 

  const material = new THREE.MeshStandardMaterial({
    color: 0x2e8b57, // Seaweed green
    roughness: 0.8,
    flatShading: false // Set to false for a smoother look
  });

  const seaweed = new THREE.Mesh(geometry, material);
  seaweed.position.copy(position);
  
  // Randomize scale for height variety
  const s = 0.6 + Math.random() * 0.8;
  seaweed.scale.set(s, s, s);

  // Randomize initial rotation
  seaweed.rotation.y = Math.random() * Math.PI;

  seaweed.userData = {
    swayOffset: Math.random() * Math.PI * 2,
    swaySpeed: 0.4 + Math.random() * 0.4 
  };

  seaweed.castShadow = true;
  return seaweed;
}

/**
 * Update function to animate seaweed
 */
export function updateSeaweed(seaweedList, time) {
  seaweedList.forEach(stalk => {
    const { swayOffset, swaySpeed } = stalk.userData;
    // Simple sine wave for organic swaying
    stalk.rotation.z = Math.sin(time * swaySpeed + swayOffset) * 0.1;
    stalk.rotation.x = Math.cos(time * swaySpeed + swayOffset) * 0.05;
  });
}