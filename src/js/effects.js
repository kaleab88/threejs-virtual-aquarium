import * as THREE from "../../lib/three.module.js";

// Create bubbles at the bottom of the aquarium
export function createBubbles(scene, count = 20, AQUARIUM) {
  const bubbles = [];

  const geometry = new THREE.SphereGeometry(0.05, 32, 32); // small, natural size
  const material = new THREE.MeshPhysicalMaterial({
  color: 0x88ccff,
  transparent: true,
  opacity: 0.4,
  roughness: 0,
  transmission: 1,   // glass-like transparency
  thickness: 0.1     // gives refraction
});


  const margin = 0.5;

  for (let i = 0; i < count; i++) {
    const bubble = new THREE.Mesh(geometry, material);
    bubble.renderOrder = 2;

    bubble.position.set(
      (Math.random() - 0.5) * AQUARIUM.width * 0.8,
      -AQUARIUM.height / 2 + margin,
      (Math.random() - 0.5) * AQUARIUM.depth * 0.8
    );

    // IMPORTANT: use direct properties (the loop expects these)
    bubble.speed = 0.01 + Math.random() * 0.015;  // rise per frame
    bubble.driftX = (Math.random() - 0.5) * 0.002; // gentle wobble
    bubble.driftZ = (Math.random() - 0.5) * 0.002;

    scene.add(bubble);
    bubbles.push(bubble);
  }

  return bubbles;
}
