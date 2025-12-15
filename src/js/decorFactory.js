import * as THREE from '../../lib/three.module.js';

export function createRock(position) {
  const geometry = new THREE.IcosahedronGeometry(0.5, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const rock = new THREE.Mesh(geometry, material);
  rock.position.copy(position);
  return rock;
}

export function createCoral(position, color = 0xff7f50) {
  const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8);
  const material = new THREE.MeshStandardMaterial({ color });
  const coral = new THREE.Mesh(geometry, material);
  coral.position.copy(position);
  return coral;
}