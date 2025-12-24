export function startLoop(renderer, scene, camera, update) {
  function animate() {
    requestAnimationFrame(animate);
    if (update) update();

    // Subtle light animation
    const time = Date.now() * 0.001;
    if (window.aquariumLight) {
      window.aquariumLight.intensity = 0.9 + Math.sin(time) * 0.1;
    }

    // Bubble animation
    if (window.bubbles) {
      window.bubbles.forEach(bubble => {
        bubble.position.y += bubble.speed;
        if (bubble.position.y > 6) {
          bubble.position.y = 0;

        }
      });
    }

    renderer.render(scene, camera);
  }
  animate();
}
