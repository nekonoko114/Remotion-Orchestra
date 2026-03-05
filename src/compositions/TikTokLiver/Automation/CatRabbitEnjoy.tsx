import type React from 'react';
import { JsonVideoEngine } from '../../../engines/JsonVideoEngine';

const WORKFLOW_DATA = {
  project: {
    id: 'CatRabbitEnjoy',
    total_duration_frames: 1200,
    fps: 30,
    description:
      'A 40-second heartwarming story of a cat and a rabbit playing together.',
  },
  workflow_steps: [
    {
      step_id: '1_generate_assets',
      tool: 'Nanobanana',
      instructions:
        'Generate consistent character style images based on the following prompts. Save paths to be referenced in Step 2.',
      tasks: [
        {
          asset_id: 'img_cat_solo',
          prompt:
            'cute fluffy cat, sitting, white background, soft lighting, pixar style, high quality',
          negative_prompt: 'low quality, text, watermark, human',
        },
      ],
    },
    {
      step_id: '2_assemble_video',
      tool: 'Remotion',
      instructions:
        'Map the generated assets to the timeline using the defined effect components.',
      timeline: [
        {
          scene_id: 'intro',
          start_frame: 0,
          duration_frames: 150,
          component: 'MotionContainer',
          props: {
            type: 'zoomIn',
            duration: 40,
          },
          child_component: {
            component: 'KineticText',
            props: {
              text: 'Cat & Rabbit Life',
              style: {
                fontSize: 80,
                color: '#ff69b4',
                fontWeight: 'bold',
              },
            },
          },
        },
        {
          scene_id: 'meeting',
          start_frame: 150,
          duration_frames: 300,
          layers: [
            {
              component: 'MotionContainer',
              props: {
                type: 'slideLeft',
                delay: 10,
              },
              content_asset_id: 'img_cat_solo',
              style: { position: 'absolute', left: '10%', width: '40%' },
            },
            {
              component: 'MotionContainer',
              props: {
                type: 'slideRight',
                delay: 30,
              },
              content_asset_id: 'img_rabbit_solo',
              style: { position: 'absolute', right: '10%', width: '40%' },
            },
          ],
        },
        {
          scene_id: 'playing',
          start_frame: 450,
          duration_frames: 390,
          component: 'GeometricMask',
          props: {
            type: 'blind',
          },
          child_component: {
            component: 'MotionContainer',
            props: {
              type: 'rotate',
              duration: 100,
            },
            content_asset_id: 'img_playing_chase',
            style: { width: '100%', height: '100%', objectFit: 'cover' },
          },
        },
        {
          scene_id: 'sleeping',
          start_frame: 840,
          duration_frames: 240,
          component: 'MotionContainer',
          props: {
            type: 'fade',
            duration: 60,
          },
          child_component: {
            component: 'MotionContainer',
            props: {
              type: 'zoomOut',
              duration: 240,
            },
            content_asset_id: 'img_sleeping_together',
            style: { width: '100%', height: '100%', objectFit: 'cover' },
          },
        },
        {
          scene_id: 'outro',
          start_frame: 1080,
          duration_frames: 120,
          component: 'GlitchEffect',
          props: {
            intensity: 5,
          },
          child_component: {
            type: 'html',
            content:
              "<h1 style='color: white; font-size: 60px;'>See You Next Time</h1>",
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: '#333',
            },
          },
        },
      ],
    },
  ],
};

export const CatRabbitEnjoy: React.FC = () => {
  return <JsonVideoEngine data={WORKFLOW_DATA} />;
};
