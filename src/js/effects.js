import * as THREE from "../../lib/three.module.js";

export function createBubbles(scene, count = 20) {
  const bubbles = [];

  const geometry = new THREE.SphereGeometry(0.03, 8, 8);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6
  });

  for (let i = 0; i < count; i++) {
    const bubble = new THREE.Mesh(geometry, material);
    bubble.position.set(
      (Math.random() - 0.5) * 6,   // random X
      Math.random() * 5,           // random Y
      (Math.random() - 0.5) * 6    // random Z
    );
    bubble.speed = 0.01 + Math.random() * 0.02;
    scene.add(bubble);
    bubbles.push(bubble);
  }

  return bubbles;
}
