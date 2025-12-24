import * as THREE from '../../lib/three.module.js';

export function createRock(position) {
  const geometry = new THREE.IcosahedronGeometry(0.5, 0);
  const material = new THREE.MeshStandardMaterial({
  color: 0x808080,   // gray rock
  roughness: 0.85,   // matte, textured feel
  metalness: 0.15    // slight shine so it catches light
});
  const rock = new THREE.Mesh(geometry, material);
  rock.position.copy(position);
  return rock;
}

export function createCoral(position, color = 0xff7f50) {
  const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8);
  const material = new THREE.MeshStandardMaterial({
  color,             // coral color passed in
  roughness: 0.95,   // very matte, organic
  metalness: 0.0     // no metallic shine
});
  const coral = new THREE.Mesh(geometry, material);
  coral.position.copy(position);
  return coral;
}