---
name: script-to-video
description: Workflow for converting a text prompt or JSON script into a full Remotion video composition.
---

# Script to Video Workflow

This skill defines the standard procedure for converting a narrative script into a video.

## 1. JSON Schema (The Blueprint)

Agents must first convert any user prompt into this JSON structure:

```json
{
  "videoMetadata": {
    "title": "Video Title",
    "durationInSeconds": 60,
    "fps": 30
  },
  "scenes": [
    {
      "timeRange": "0s - 5s",
      "scene": "Scene Title",
      "description": "Visual description for image generation.",
      "visualEffects": "Specific Remotion/Three.js effects (e.g., Blur, Zoom, Particles).",
      "audio": "Audio description (BGM/SFX)."
    }
  ]
}
```

## 2. Production Steps

### Phase A: Asset Generation

1.  Iterate through `scenes`.
2.  Use `generate_image` (Nano Banana) for each scene based on `description`.
3.  Save assets as `public/images/generated/{project_name}/scene_{N}.png`.

### Phase B: Composition Logic

1.  Create a new directory: `src/compositions/{ProjectName}/`.
2.  Create `index.tsx` calculating frame ranges from `timeRange`.
3.  Create individual `Scene{N}.tsx` components.
    - **Static:** Display the generated image.
    - **Motion:** Apply `visualEffects` using Remotion's `interpolate`, `useCurrentFrame`, or Three.js.

### Phase C: Assembly

1.  Use `<Sequence>` to arrange scenes in `index.tsx`.
2.  Register the composition in `Root.tsx`.
