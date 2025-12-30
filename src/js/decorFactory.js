import * as THREE from '../../lib/three.module.js';

// Coral palette used for both rocks and coral for a cohesive seabed look
const coralColors = [0xff6666, 0xff9966, 0xcc66ff, 0xffcc66, 0xff7f50, 0xf4a460];

function randomCoralColor() {
  return coralColors[Math.floor(Math.random() * coralColors.length)];
}

export function createRock(position) {
  const geometry = new THREE.IcosahedronGeometry(0.5, 0);

  // Coral-toned rock material for unified palette
  const material = new THREE.MeshStandardMaterial({
    color: randomCoralColor(),
    roughness: 0.85,
    metalness: 0.1
  });

  const rock = new THREE.Mesh(geometry, material);
  rock.position.copy(position);
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
