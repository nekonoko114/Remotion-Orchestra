---
name: genai-pipeline
description: Workflow for automating asset generation using Luma, OpenAI, and Replicate.
---

# GenAI Production Pipeline

This skill enables automated high-quality asset generation for Remotion projects.

## Cost Estimates

- **Video (Luma Ray 2):** ~¥25.0 / generation
- **Narration (OpenAI TTS):** ~¥0.5 / generation
- **BGM (Stable Audio):** ~¥2.0 / generation

## Setup

1.  **API Keys:** Add the following to your `.env` file:

    ```env
    LUMA_API_KEY=your_key_here
    OPENAI_API_KEY=your_key_here
    REPLICATE_API_TOKEN=your_token_here
    ```

2.  **Scripts:** Use the provided scripts in `scripts/` to generate content.
    - `npx tsx scripts/generate_openai_tts.ts "Hello world"`
    - `npx tsx scripts/generate_replicate_music.ts "Lo-Fi hip hop for a cat video"`

## Workflow integration

When a script is received via `script_to_video.md`, the AI assistant will call these scripts to populate `public/assets/` before implementing the Remotion composition.
