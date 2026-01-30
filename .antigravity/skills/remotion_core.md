---
name: remotion-core
description: Core architectural patterns and best practices for Remotion projects, including 3D and automated workflows.
---

# Remotion Project Core Guidelines

> [!IMPORTANT]
> **OFFICIAL SKILLS REFERENCE**
> Before applying any custom patterns below, **ALWAYS** Consult the official Remotion Skills located in:
> `[Official Skills](file:///Users/sumash/Developer/remotion-projects/RemotionOrchestra/.antigravity/skills/official/remotion/SKILL.md)`
> These files contain the authoritative rules for animations, assets, and performance.

This skill defines the standard "Antigravity Style" for building Remotion compositions. Follow these rules to ensure performance, maintainability, and seamless AI integration.

## 1. Project Structure (The "Orchestra" Layout)

We organize compositions as "Movements" in a symphony.

```text
src/
├── Root.tsx             # Main entry, defines <Composition>s
├── compositions/        # Independent video segments
│   ├── Intro/
│   │   ├── index.tsx    # Composition component
│   │   └── Scene.tsx    # 3D/Effects logic
│   └── MainFeature/
├── components/          # Reusable UI/Effects (Atoms)
│   ├── Three/           # R3F Components (e.g., <NeonGrid />)
│   └── UI/              # Tailwind UI overlay
├── assets/              # Static assets
└── types/               # TypeScript definitions
```

## 2. The `<ThreeCanvas>` Pattern

When integrating Three.js, **NEVER** instantiate the canvas inside a deeply nested loop.

- **Structure:** Wrap the 3D scene in an `AbsoluteFill` container.
- **Camera:** Use `<PerspectiveCamera>` from `@react-three/drei`.
- **Responsiveness:** Use `useVideoConfig()` to sync canvas size.

```tsx
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Canvas } from "@react-three/fiber";

export const Global3DLayer = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Canvas
        gl={{ alpha: true }} // Transparent background for compositing
        camera={{ position: [0, 0, 10], fov: 50 }}
        // Use the Antigravity Lighting Skill here!
      >
        <ambientLight intensity={0.5} />
        <My3DScene />
      </Canvas>
    </AbsoluteFill>
  );
};
```

## 3. Dynamic Asset Handling (Veo / Nano Banana)

Antigravity Agents generate assets into specific folders. Use `staticFile()` for referencing them.

- **Nano Banana Images:** `public/images/generated/{id}.png`
- **Veo Videos:** `public/videos/veo/{id}.mp4`

```tsx
import { staticFile } from "remotion";
import { Video } from "remotion";

// Correct usage for dynamically generated assets
<Video src={staticFile("videos/veo/background_01.mp4")} />;
```

## 4. Performance Rules

1.  **Do NOT use `useEffect` for animation.** Use `useCurrentFrame()` and `interpolate()`.
    - _Bad:_ `useEffect(() => { animate() }, [])`
    - _Good:_ `const frame = useCurrentFrame(); const rotate = interpolate(frame, [0, 100], [0, Math.PI])`
2.  **Resource Heavy 3D:** If a 3D scene is too heavy, render it separately as a transparent video (Alpha Channel) using `npx remotion render` and import it as a `<Video />`.

## 5. Agent Workflow for New Compositions

When asked to "Create a new scene":

1.  Define the `id` and `durationInFrames` in `Root.tsx`.
2.  Create the folder in `src/compositions/{Name}`.
3.  Implement the visual logic using Tailwind for 2D and Fiber for 3D.
