---
name: ai-video-router
description: Logic for routing video generation tasks to the optimal AI model (Kling vs Wan 2.1) based on scene requirements.
---

# AI Video Model Router

This skill acts as a decision matrix to automatically select the best video generation model for a given scene.

## 1. Decision Logic ( The Criteria )

The router evaluates each scene based on **Motion Score (0-10)** and **Content Type**.

| Criteria                 | Motion Score | Recommended Model | Reasoning                                                                                       |
| :----------------------- | :----------- | :---------------- | :---------------------------------------------------------------------------------------------- |
| **High Dynamics**        | 7 - 10       | **Kling AI**      | Superior physics simulation (fluids, complex body movements, gravity). Best for "Action" shots. |
| **Static / Atmospheric** | 0 - 4        | **Wan 2.1**       | Excellent texture detail and prompting fidelity. Best for "B-Roll" or "Backgrounds".            |
| **Text / Graphical**     | N/A          | **Wan 2.1**       | Higher coherence for text in video.                                                             |
| **Character Close-up**   | 5 - 10       | **Kling AI**      | Better facial micro-expressions and natural muscle movement.                                    |

## 2. Router Agent Prompt Template

Use this prompt pattern when instructing an agent to plan video generation:

```markdown
You are the **Video Production Manager**. Analyze the following scene description and assign the correct AI model.

**Scene Description:**
"{SCENE_DESCRIPTION}"

**Analysis Task:**

1.  **Motion Score (0-10):** How much movement and physical interaction is required?
2.  **Text Requirement:** Is there legible text in the scene? (Yes/No)
3.  **Primary Element:** Character / Landscape / Object / Abstract

**Routing Decision:**
IF (Motion Score >= 7) OR (Primary Element == "Character" AND Motion Score >= 5):
-> USE **Kling AI**
ELSE IF (Text Requirement == "Yes") OR (Motion Score <= 4):
-> USE **Wan 2.1**
ELSE:
-> USE **Wan 2.1** (Default for safety/quality)

**Output Format:**

- **Model:** [Kling | Wan]
- **Reasoning:** [Brief explanation]
- **Optimized Prompt:** [The prompt tailored for the specific model]
```

## 3. Workflow Implementation

### Step A: Pre-flight Check

Ensure the following environment variables are set in `.env`:

- `REMOTION_KLING_API_KEY` (for Kling AI)
- `REMOTION_WAN_API_KEY` (for Wan 2.1)

### Step B: Analysis

Run the "Router Agent Prompt" against the storyboard/JSON data.

### Step C: Execution

- **If Kling:** Ensure prompt focuses on _verbs_ (action, movement).
- **If Wan:** Ensure prompt focuses on _adjectives_ (style, lighting, texture).

### Step D: Asset Placement

Save the generated file to `src/assets/video/{scene_id}_{model_name}.mp4` to track which model was used.
