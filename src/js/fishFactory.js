import * as THREE from '../../lib/three.module.js';

export function createFish({ color = 0x4da6ff, scale = 1 }) {
  const group = new THREE.Group();

  // Body
  const bodyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.scale.set(1.2, 0.8, 0.6);

  // Tail
  const tailGeometry = new THREE.ConeGeometry(0.2, 0.5, 12);
  const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
  tail.rotation.z = Math.PI;
  tail.position.x = -0.6;

  group.add(body);
  group.add(tail);

  group.scale.set(scale, scale, scale);

  return group;
}