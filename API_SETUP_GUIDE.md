# API Setup Guide: The Fuel for Your Orchestra

To fully power the Antigravity Orchestration Hub, you need to set up the following API keys in your `.env` file.
This guide reflects your current environment preferences (Wan 2.1, Luma AI, ElevenLabs).

## 1. Video Generation (High Fidelity) - Configured ✅

**Role:** Generates beautiful, texture-rich videos and handles text-heavy scenes.

- **Provider:** Wan 2.1 (via Replicate/Fal) or Kling AI
- **Output:** `/src/assets/video/...`
- **Variable:** `REMOTION_WAN_API_KEY` (Wan 2.1)

## 2. Video Generation (High Motion) - Configured ✅

**Role:** Generates high-fidelity video with complex physics.

- **Provider:** Luma AI (Dream Machine)
- **Variable:** `LUMA_API_KEY`
- **Variable:** `REPLICATE_API_TOKEN` (for other models)

## 3. Audio & Music Generation - Setup Required ⚠️

**Role:** Generates BGM, SFX, and Voice Overs.

- **Provider (Music & Voice):** **ElevenLabs** (User Preference)
- **Variable:** `ELEVENLABS_API_KEY` (Add this to your .env!)

---

## Native Tools (Internal)

The following are built into your Antigravity environment and do not require keys:

- **Veo** (Google DeepMind Video)
- **Nano Banana Pro** (Google DeepMind Image)
- **Gemini 3 Pro** (Intelligence)

## How to Set Keys

1. Open the `.env` file in the project root.
2. Add or update the keys as follows:

   ```bash
   # AI Video Generation
   REMOTION_WAN_API_KEY="97fd..."
   LUMA_API_KEY="luma-..."
   REPLICATE_API_TOKEN="r8_..."

   # Audio Generation
   ELEVENLABS_API_KEY="sk-..."  # <-- Add this!
   OPENAI_API_KEY="sk-..."      # Used for Scripting/Orchestration
   ```

3. Save the file.
