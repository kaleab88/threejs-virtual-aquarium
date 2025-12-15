import * as THREE from "../../lib/three.module.js";
export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b132b);
  return scene;
}