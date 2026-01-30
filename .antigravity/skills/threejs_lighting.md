---
name: verify-threejs-lighting
description: Instructions for achieving cinematic, high-quality lighting in Three.js scenes.
---

# High- Fidelity Three.js Lighting Setup

This skill provides a blueprint for setting up "Pro" level lighting in Three.js, ensuring your scenes look like high-end renders rather than default WebGL experiments.

## 1. Renderer Configuration (The Foundation)

Before adding a single light, you must configure the renderer for physically correct lighting.

```javascript
// In your Three.js setup (e.g., inside a React Three Fiber Canvas or vanilla JS)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});

// CRITICAL: Use correct color space
renderer.outputColorSpace = THREE.SRGBColorSpace; // formerly outputEncoding = sRGBEncoding

// CRITICAL: Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer, more realistic shadows

// CRITICAL: Tone Mapping for realistic dynamic range
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
```

## 2. Environment Lighting (HDRI)

The secret to realistic reflections and ambient light is NOT `AmbientLight`, but an **HDRI Environment map**.

- **Do not use** `AmbientLight` for main illumination (it flattens the 3D look).
- **Use** `RGBELoader` to load `.hdr` or `.exr` files.

```javascript
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

new RGBELoader().load("path/to/studio_small_09_4k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  // scene.background = texture; // Optional: If you want to see the HDRI
});
```

**Pro Tip:** Use a "Studio" HDRI for clean product/character showcases, and an "Outdoor" HDRI for architectural or nature scenes.

## 3. Key Lighting Setup (Three-Point Lighting)

Supplement the HDRI with specific lights to shape the subject.

### A. Key Light (Main Source)

Usually a `DirectionalLight` (sun) or `SpotLight` (studio lamp).

```javascript
const keyLight = new THREE.DirectionalLight(0xffffff, 2.5); // Intensity > 1 for physical correctness
keyLight.position.set(5, 10, 7);
keyLight.castShadow = true;

// Shadow quality settings
keyLight.shadow.mapSize.width = 2048; // crisp shadows
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0001; // Reduce shadow acne
scene.add(keyLight);
```

### B. Rim Light (Back Light)

Crucial for separating the subject from the background. Creates a glorious glowing edge.

```javascript
const rimLight = new THREE.SpotLight(0x00eeff, 5.0); // Cyan tint for cool contrast
rimLight.position.set(-5, 5, -5);
rimLight.lookAt(subject.position);
scene.add(rimLight);
```

### C. Fill Light (Soft)

Use a very weak `HemisphereLight` ONLY if shadows are too black.

```javascript
const fillLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5); // SkyColor, GroundColor, Intensity
scene.add(fillLight);
```

## 4. Materials (MeshStandardMaterial / MeshPhysicalMaterial)

Lighting needs good materials to interact with.

- Always use `roughness` and `metalness` maps if available.
- For skin or organic objects, use `MeshPhysicalMaterial` with `subsurface` (SSS) properties if performance allows.

## 5. Post-Processing (The Polish)

Raw 3D renders often look "dry". Add `EffectComposer` with **Bloom** for glow.

```javascript
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, // strength
  0.4, // radius
  0.85, // threshold - only very bright things glow
);
composer.addPass(bloomPass);
```

## Summary Checklist

1.  [ ] `outputColorSpace = SRGBColorSpace`
2.  [ ] `toneMapping = ACESFilmicToneMapping`
3.  [ ] `shadowMap.enabled = true`
4.  [ ] HDRI Environment Map loaded
5.  [ ] Key Light with Shadows enabled
6.  [ ] Rim Light for edge definition
