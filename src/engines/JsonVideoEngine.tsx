import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Video,
  staticFile,
} from 'remotion';
import { z } from 'zod';
import * as Effects from '../components/effects';
import * as Transitions from '../types/transitions';
import { TextOverlay } from '../components/UI/TextOverlay';

// --- Schema Definitions ---
const ComponentPropsSchema = z.record(z.unknown());

const TimelineComponentSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    component: z.string().optional(),
    type: z.enum(['html', 'component', 'asset']).optional(),
    props: ComponentPropsSchema.optional(),
    child_component: TimelineComponentSchema.optional(),
    content_asset_id: z.string().optional(),
    content: z.string().optional(),
    style: z.record(z.unknown()).optional(),
  }),
);

const SceneSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  label: z.string().optional(),
  duration: z.number().optional(),
  duration_frames: z.number().optional(),
  layers: z.array(TimelineComponentSchema).optional(),
  component: z.string().optional(),
  effect: z.string().optional(),
  transition: z.string().optional(),
  props: ComponentPropsSchema.optional(),
  child_component: TimelineComponentSchema.optional(),
  content_asset_id: z.string().optional(),
  start_frame: z.number().optional(),
  end_frame: z.number().optional(),
  // Add AI specific fields
  text_primary: z.string().optional(),
  text_secondary: z.string().optional(),
  color_theme: z.string().optional(),
});

const EngineDataSchema = z.object({
  project: z
    .object({
      id: z.string(),
      total_duration_frames: z.number().optional(),
      fps: z.number().optional(),
    })
    .optional(),
  timeline: z.array(SceneSchema).optional(),
  audioTracks: z
    .array(
      z.object({
        src: z.string(),
        volume: z.number().optional(),
      }),
    )
    .optional(),
});

type TimelineComponent = z.infer<typeof TimelineComponentSchema>;
// --- Component Registry ---
// Using any for registry to avoid type conflicts with mixed exports (like HardTransitions object)
const EFFECT_REGISTRY: Record<string, any> = Effects;

const TRANSITION_REGISTRY: Record<string, any> = Transitions;

const ComponentMapper: React.FC<{
  item: TimelineComponent;
  projectId?: string;
}> = ({ item, projectId }) => {
  let content: React.ReactNode = null;

  // 1. Resolve Content
  if (item.type === 'html' && item.content) {
    content = (
      <div
        dangerouslySetInnerHTML={{ __html: item.content }}
        style={item.style as React.CSSProperties}
      />
    );
  } else if (item.content_asset_id) {
    const assetPath = `assets/images/generated/${projectId || 'General'}/${item.content_asset_id}.jpg`;
    content = (
      <Img
        src={staticFile(assetPath)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...(item.style as React.CSSProperties),
        }}
      />
    );
  } else if (
    item.component &&
    typeof EFFECT_REGISTRY[item.component] === 'function'
  ) {
    const Comp = EFFECT_REGISTRY[item.component];
    const props = item.props || {};
    content = <Comp {...props} />;
  } else if (
    item.component &&
    typeof TRANSITION_REGISTRY[item.component] === 'function'
  ) {
    // If a transition is mistakenly placed in 'component' field, still try to render it
    const TransitionComp = TRANSITION_REGISTRY[item.component];
    const props = item.props || {};
    content = <TransitionComp {...props} />;
  } else if (item.component === 'Video' && item.props?.src) {
    const src = item.props.src as string;
    const videoSrc = src.startsWith('http') ? src : staticFile(src);
    const { src: _src, ...rest } = item.props as any;
    content = (
      <Video
        src={videoSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...(item.style as React.CSSProperties),
        }}
        {...rest}
      />
    );
  } else if (item.component === 'Img' && item.props?.src) {
    const src = item.props.src as string;
    const imgSrc = src.startsWith('http') ? src : staticFile(src);
    const { src: _src, ...rest } = item.props as any;
    content = (
      <Img
        src={imgSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...(item.style as React.CSSProperties),
        }}
        {...rest}
      />
    );
  } else if (item.child_component) {
    content = (
      <ComponentMapper item={item.child_component} projectId={projectId} />
    );
  }

  // 2. Wrap with registered Effects if specified in 'component' field but treated as wrapper
  // In Orcherstra, we often use component field for the main effect.
  // We'll prioritize the registry above.

  return (
    <AbsoluteFill style={item.style as React.CSSProperties}>
      {content}
    </AbsoluteFill>
  );
};

const TRANSITION_DURATION = 30;

export const JsonVideoEngine: React.FC<{ data: any }> = ({ data: rawData }) => {
  // 1. Validate Data
  const result = EngineDataSchema.safeParse(rawData);
  if (!result.success) {
    console.error('❌ Invalid Timeline JSON:', result.error);
    return (
      <AbsoluteFill style={{ backgroundColor: 'red', color: 'white' }}>
        Invalid JSON Data
      </AbsoluteFill>
    );
  }
  const data = result.data;

  const timeline = data.timeline || [];
  const projectId = data.project?.id || 'General';
  const audioTracks = data.audioTracks || [];

  const getSceneContent = (scene: any) => {
    let content = scene.layers ? (
      scene.layers.map((layer: any, lIdx: number) => (
        <ComponentMapper key={lIdx} item={layer} projectId={projectId} />
      ))
    ) : (
      <ComponentMapper
        item={{
          component: scene.component,
          props: scene.props,
          child_component: scene.child_component,
          content_asset_id: scene.content_asset_id,
          style: { width: '100%', height: '100%' },
        }}
        projectId={projectId}
      />
    );

    // Apply Scene-level Effect if specified
    if (scene.effect && EFFECT_REGISTRY[scene.effect]) {
      const Effect = EFFECT_REGISTRY[scene.effect];
      content = <Effect>{content}</Effect>;
    }

    return content;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {audioTracks.map((track, i) => (
        <Audio
          // biome-ignore lint/suspicious/noArrayIndexKey: Audio tracks
          key={i}
          src={track.src.startsWith('http') ? track.src : staticFile(track.src)}
          volume={track.volume}
        />
      ))}

      {timeline.map((scene, index) => {
        const nextScene = timeline[index + 1];
        const startFrame = scene.start_frame ?? index * 150;
        const endFrame =
          scene.end_frame ?? startFrame + (scene.duration ?? 150);
        const duration = endFrame - startFrame;

        const transitionName = scene.transition;
        const TransitionComp = transitionName
          ? TRANSITION_REGISTRY[transitionName]
          : null;

        // Case A: No transition or last scene
        if (!TransitionComp || !nextScene) {
          return (
            <Sequence
              key={scene.id || index}
              from={startFrame}
              durationInFrames={duration}
            >
              <AbsoluteFill style={{ overflow: 'hidden' }}>
                <AbsoluteFill>{getSceneContent(scene)}</AbsoluteFill>
                {(scene.text_primary || scene.text_secondary) && (
                  <TextOverlay
                    primary={scene.text_primary}
                    secondary={scene.text_secondary}
                    theme={scene.color_theme}
                  />
                )}
              </AbsoluteFill>
            </Sequence>
          );
        }

        // Case B: Has transition.
        // Render normal part, then transition part.
        const normalDuration = duration - TRANSITION_DURATION;

        return (
          <React.Fragment key={scene.id || index}>
            {/* Normal Part */}
            <Sequence from={startFrame} durationInFrames={normalDuration}>
              <AbsoluteFill style={{ overflow: 'hidden' }}>
                <AbsoluteFill>{getSceneContent(scene)}</AbsoluteFill>
                {(scene.text_primary || scene.text_secondary) && (
                  <TextOverlay
                    primary={scene.text_primary}
                    secondary={scene.text_secondary}
                    theme={scene.color_theme}
                  />
                )}
              </AbsoluteFill>
            </Sequence>

            {/* Transition Part (Coupled) */}
            <Sequence
              from={startFrame + normalDuration}
              durationInFrames={TRANSITION_DURATION}
            >
              <TransitionComp
                from={getSceneContent(scene)}
                to={getSceneContent(nextScene)}
                durationInFrames={TRANSITION_DURATION}
              />
              {/* Note: In transition part, we might want to hide/show text selectively. */}
              {(scene.text_primary || scene.text_secondary) && (
                <TextOverlay
                  primary={scene.text_primary}
                  secondary={scene.text_secondary}
                  theme={scene.color_theme}
                />
              )}
            </Sequence>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
