import * as THREE from '../../lib/three.module.js';

export function createFish({ color = 0xff8844, scale = 1 }) {
  const group = new THREE.Group();

 /* ======================
   BODY (with selectable gradient texture)
   ====================== */
const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);

const loader = new THREE.TextureLoader();

// Default gradient
let texturePath = 'public/textures/fish-gradient-blue-silver.png';

// Choose gradient by color (you can expand these rules)
if (color === 0xffff00) texturePath = 'public/textures/fish-gradient-blue-silver.png';
if (color === 0x00ffff) texturePath = 'public/textures/fish-gradient-teal-golden.png';


const gradientTexture = loader.load(texturePath);
gradientTexture.rotation = Math.PI / 2;
gradientTexture.center.set(0.5, 0.5);
gradientTexture.wrapS = THREE.RepeatWrapping;
gradientTexture.wrapT = THREE.RepeatWrapping;
gradientTexture.repeat.set(2, 1);

// Optimized for Visibility + Fog + Realism
const bodyMaterial = new THREE.MeshStandardMaterial({
  map: gradientTexture,    // Keep your texture
  color: color,            // Ensure the base color is applied
  roughness: 0.4,          // Slightly smoother for better highlights
  metalness: 0.15,         // Subtle scale-like sheen
  
  // THE FIX: Higher emissive values to cut through the fog
  emissive: new THREE.Color(color).multiplyScalar(0.12), 
  emissiveIntensity: 0.8
});

bodyMaterial.color.offsetHSL(0.02, 0.1, 0.05);

const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.scale.set(1.4, 0.8, 0.6);
group.add(body);


  /* =====================
     TAIL (EXTRUDED SHAPE)
     ===================== */
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0.05, 0);
  tailShape.lineTo(-0.45, 0.45);
  tailShape.lineTo(-0.3, 0.1);
  tailShape.lineTo(-0.45, -0.45);
  tailShape.lineTo(0.05, 0);

  const extrudeSettings = { depth: 0.05, bevelEnabled: false };
  const tailGeometry = new THREE.ExtrudeGeometry(tailShape, extrudeSettings);
  const tailMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.x = -0.7;
  tail.rotation.y = Math.PI / 2;
  group.add(tail);

  /* =====================
     FINS
     ===================== */
  const finMaterial = bodyMaterial;

  const dorsal = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25), finMaterial);
  dorsal.rotation.x = -Math.PI / 2;
  dorsal.position.set(-0.05, 0.35, 0);
  group.add(dorsal);

  const finGeo = new THREE.PlaneGeometry(0.3, 0.2);
  const leftFin = new THREE.Mesh(finGeo, finMaterial);
  leftFin.position.set(0.25, -0.05, 0.28);
  leftFin.rotation.y = Math.PI / 5;
  group.add(leftFin);

  const rightFin = leftFin.clone();
  rightFin.position.z = -0.28;
  rightFin.rotation.y = -Math.PI / 5;
  group.add(rightFin);

  /* =====================
     EYES
     ===================== */
  const eyeGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(0.45, 0.1, 0.18);
  group.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.z = -0.18;
  group.add(rightEye);

  /* =====================
     SCALE
     ===================== */
  group.scale.set(scale, scale, scale);

  /* =====================
     MOVEMENT DATA
     ===================== */
  group.userData = {
    baseColor: color,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.02
    ),
    speed: 1,
    swimOffset: Math.random() * Math.PI * 2,
    tail,
    body,
    fins: [leftFin, rightFin, dorsal]
  };

  return group;
}
