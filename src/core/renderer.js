import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);
  return renderer;
}