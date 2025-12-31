export function startLoop(renderer, scene, camera, update) {
  function animate() {
    requestAnimationFrame(animate);
    if (update) update();

    // Subtle underwater shimmer
if (window.aquariumLight) {
  const time = Date.now() * 0.001;
  window.aquariumLight.intensity = 0.9 + Math.sin(time * 0.5) * 0.2;
}


// Bubble animation
if (window.bubbles && window.AQUARIUM) {
  const topY = window.AQUARIUM.height / 2;
  const bottomY = -window.AQUARIUM.height / 2 + 0.5;

  window.bubbles.forEach(bubble => {
    // Guard against missing props
    const s = typeof bubble.speed === "number" ? bubble.speed : 0.01;
    const dx = typeof bubble.driftX === "number" ? bubble.driftX : 0;
    const dz = typeof bubble.driftZ === "number" ? bubble.driftZ : 0;

    bubble.position.y += s;
    bubble.position.x += dx;
    bubble.position.z += dz;

    if (bubble.position.y > topY) {
      bubble.position.y = bottomY;
      bubble.position.x = (Math.random() - 0.5) * window.AQUARIUM.width * 0.8;
      bubble.position.z = (Math.random() - 0.5) * window.AQUARIUM.depth * 0.8;
    }
  });
}


    renderer.render(scene, camera);
  }
  animate();
}
