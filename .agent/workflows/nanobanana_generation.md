---
description: Generate character-consistent images using Nanobanana (Standard Antigravity Feature) with Image-to-Image reference.
---

# Nanobanana Image Generation Workflow

This workflow uses Antigravity's standard `generate_image` capability (referred to as Nanobanana) to generate new character images while maintaining consistency by referencing the master character assets.

## Steps

1.  **Identify Character and Scene**
    - Determine the target `character` (e.g., Nova, Yuka) and the desired `scene/prompt` from the user's request.
    - Example: "Nova reading a book in the library".

2.  **Resolve Master Image Path**
    - Read `src/constants/characters.ts` (or use internal knowledge if recently read) to find the character's asset file.
    - Convert the `staticFile` path to an **absolute path** on the local system.
    - _Path Mapping Rule_:
      - `staticFile("assets/...")` -> `/Users/sumash/Developer/remotion-projects/KALEIDANOVA/public/assets/...`

3.  **Construct Prompt**
    - Create a detailed prompt that includes:
      - **Character Description**: (e.g., "Silver hair, purple eyes, futuristic anime style") - _Refer to `docs/Characters.md` if needed._
      - **Scene Description**: The specific action or setting requested.
      - **Style Keywords**: "Anime style, high quality, consistent character design, vibrant colors".

4.  **Execute Generation (Nanobanana)**
    - Call the `generate_image` tool.
    - **Prompt**: The constructed detailed prompt.
    - **ImagePaths**: `["/absolute/path/to/master/character/image.png"]` (The resolved master image).
    - **ImageName**: `nanobanana_[character]_[short_scene_desc]`.

5.  **Review and Finalize**
    - The tool will generate an artifact.
    - Present the result to the user.
    - If approved, move the artifact to the project's asset directory (e.g., `public/assets/generated/`) using `run_command` (mv).

## Example Interaction

**User**: "NanobananaでNovaがカフェでコーヒーを飲んでいる画像を作って"

**Agent Action**:

1.  Look up Nova in `characters.ts` -> finds `nova.PNG`.
2.  Resolve path: `/Users/sumash/.../public/assets/characters/nova.PNG`.
3.  Call `generate_image`:
    - Prompt: "Silver haired anime girl, purple eyes, drinking coffee in a cozy cafe, sunlight streaming in, detailed background, anime style."
    - ImagePaths: [`.../nova.PNG`]
4.  Show result.
