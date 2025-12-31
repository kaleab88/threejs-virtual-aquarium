import * as THREE from "../../lib/three.module.js";
export function createScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a1a2a, 5, 25);
  scene.background = new THREE.Color(0x08121c);
  return scene;
}