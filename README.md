# Virtual Aquarium — Three.js Project

An interactive 3D virtual aquarium built using Three.js, developed as a web-based simulation to demonstrate core computer graphics concepts such as 3D modeling, materials, lighting, animation, and user interaction.

Live Demo:  
https://kaleab88.github.io/threejs-virtual-aquarium/

---

## Project Overview
This project was developed for the **Interactive 3D Web Applications with Three.js** course.  
It implements a **Virtual Aquarium simulation**, focusing on realism, performance, and clean modular design.

---

## Implemented Features

### 3D Modeling & Scene Composition
- Multiple unique 3D objects including fish, rocks, coral, aquarium boundaries, and decorative elements
- Hierarchical scene graph using `THREE.Group` for complex animated objects

### Materials & Textures (PBR)
- Texture mapping applied to sand floor and rocks
- Physically Based Rendering (PBR) materials using `MeshStandardMaterial`
- Tuned roughness and metalness values for realistic underwater surfaces
- Color contrast adjustments to maintain visibility under fog

### Fish Behavior & Animation
- Procedurally generated fish meshes with fins, tails, and eyes
- Boundary-avoidance movement system using math-based steering logic (not collision-based)
- Smooth swimming motion with side-to-side tail animation and subtle fin movement
- Time-based animation for consistent motion across devices

### Environment & Atmosphere
- Exponential depth-based fog using Three.js fog classes to simulate water volume
- Ambient and directional lighting to represent underwater sunlight
- Dynamic light intensity and color shifts for realism

### Procedural Vegetation
- Seaweed created using simple geometry
- Animated using trigonometric functions (sine waves) to simulate natural underwater swaying

### Effects & Interaction
- Bubble particle effects for underwater ambience
- OrbitControls for camera navigation
- Raycasting for fish selection and interaction

---

## Technical Concepts Demonstrated
- Scene graph management
- Geometry construction and grouping
- Texture mapping and PBR materials
- Lighting models (ambient and directional)
- Fog systems (depth-based fog)
- Trigonometric animation (sine-based motion)
- Rule-based AI movement logic
- User interaction via raycasting and camera controls

---

## Controls
- Rotate camera: Left mouse button + drag  
- Zoom: Mouse wheel  
- Pan: Right mouse button + drag  
- Select fish: Click on a fish object  

---

## Technology Stack
- Three.js (ES Module build)
- OrbitControls
- Raycasting for interaction
- GitHub Pages for deployment

---

## How to Run Locally
1. Clone or download the repository
2. Open the project in VS Code or a similar editor
3. Run a local server (e.g., Live Server extension)
4. Open `index.html` in your browser

---

## Deployment
The project is hosted on **GitHub Pages** and accessible through the live demo link above.

---

## Academic Notes
- The project fulfills all technical requirements specified in the course brief
- Demonstrates understanding of materials, lighting, animation, and interaction
- Implemented without external paid assets or physics engines
- Designed for evaluation, demonstration, and presentation
