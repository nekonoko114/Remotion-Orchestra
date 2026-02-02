---
name: Narration Generation Skill
description: Generates MP3 narration from text and integrates it into the Remotion project.
---

# Narration Generation Skill

This skill allows the agent to generate MP3 audio files from text using Google Text-to-Speech (gTTS) and automatically integrate them into the Remotion project.

## Capabilities

1.  **Generate Audio**: Converts text input into an MP3 file.
2.  **Integrate**: Adds the new audio file to `src/constants/audio_assets.ts`.

## Usage Instructions

To use this skill, follow these steps:

1.  **Run the Generation Script**:
    Use `run_terminal_cmd` to execute the python script.

    ```bash
    python3 scripts/gen_audio.py --text "Your text here" --character "character_name" --out "public/assets/audio"
    ```

2.  **Update Asset Registry**:
    After the script runs, it will output the filename. You must then update `src/constants/audio_assets.ts` to import this new file.

    Use `replace_file_content` (or `multi_replace_file_content`) to add the new entry.

    **Example update:**

    ```typescript
    import { staticFile } from "remotion";

    export const AUDIO_ASSETS = {
      // ... existing assets
      character_name_timestamp: staticFile(
        "assets/audio/character_name_timestamp.mp3",
      ),
    };
    ```

    _Note: Use a unique key based on the filename/timestamp._

## Prerequisites

- Python 3.x
- `gTTS` library (`pip install gTTS`)

## File Structure

- Script: `scripts/gen_audio.py`
- Output Directory: `public/assets/audio/`
- Registry File: `src/constants/audio_assets.ts`
