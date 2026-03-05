export interface Scene {
  id: number;
  label: string;
  effect: string;
  text_primary: string;
  text_secondary: string;
  color_theme: string;
  duration_frames: number;
  start_frame: number;
  end_frame: number;
}

export interface AssetPrompts {
  music: string;
  sfx: string;
  video: string;
  voice: string;
}

export interface GeneratedAssets {
  id: string;
  prompt: string;
  music: string | null;
  sfx: string | null;
  voice: string | null;
  video: string | null;
  generatedAt: string;
  lastUpdated?: string;
  source?: string;
  scene_images?: Record<string, string>;
}

export interface OrchestraTimeline {
  title: string;
  concept: string;
  timeline: Scene[];
  asset_prompts: AssetPrompts;
  generated_assets: GeneratedAssets;
  players?: unknown; // Legacy support for battle videos
}
