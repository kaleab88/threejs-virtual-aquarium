export function setupResize(camera, renderer) {
  function onResize() {
    // Safety guard
    if (!renderer || !camera) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // performance cap
  }

  window.addEventListener("resize", onResize);
  onResize(); // run once at start
}
