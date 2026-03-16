import React from 'react';
import { EffectCatalog } from './effect-catalog';
import { VideoEffectBuilder } from './VideoEffectBuilder';

type EffectProps = {
  style?: React.CSSProperties;
};

// Helper function to create a component from a catalog ID
const createEffectComponent = (id: string) => {
  const recipe = EffectCatalog.find(r => r.id === id);
  if (!recipe) throw new Error(`Effect recipe with id "${id}" not found.`);
  
  const EffectComponent: React.FC<EffectProps> = ({ style }) => (
    <VideoEffectBuilder recipe={recipe} style={style} />
  );
  EffectComponent.displayName = `Effect(${id})`;
  return EffectComponent;
};

// --- Exported Individual Effect Components ---

export const BaseFire = createEffectComponent('base-fire');
export const BlueGhostFire = createEffectComponent('blue-ghost-fire');
export const ToxicGreenFire = createEffectComponent('toxic-green-fire');
export const NoisyExplosion = createEffectComponent('noisy-explosion');
export const DarkMagicBlast = createEffectComponent('dark-magic-blast');
export const HeavyBlurGlow = createEffectComponent('heavy-blur-glow');
export const ThunderStrikeCyan = createEffectComponent('thunder-strike-cyan');
export const BokehDreamPink = createEffectComponent('bokeh-dream-pink');
export const RainbowGlitchParticles = createEffectComponent('rainbow-glitch-particles');
export const DarkMatterAbstract = createEffectComponent('dark-matter-abstract');
export const GoldenStardust = createEffectComponent('golden-stardust');
export const CyberTunnelGreen = createEffectComponent('cyber-tunnel-green');
export const FiveElementSurge = createEffectComponent('five-element-surge');
export const DeepSpaceBokeh = createEffectComponent('deep-space-bokeh');
export const CursedFireFragment = createEffectComponent('cursed-fire-fragment');
export const NeonRpgStroke = createEffectComponent('neon-rpg-stroke');
export const ParticleFireStorm = createEffectComponent('particle-fire-storm');
export const MagicalCircleAura = createEffectComponent('magical-circle-aura');
export const GreenPlasmaField = createEffectComponent('green-plasma-field');
export const HolyStarGlow = createEffectComponent('holy-star-glow');
export const RainbowInfinityLight = createEffectComponent('rainbow-infinity-light');
export const GlitchingAbstractWave = createEffectComponent('glitching-abstract-wave');
export const CrimsonOverchargeLightning = createEffectComponent('crimson-overcharge-lightning');
export const GoldenDivineSmite = createEffectComponent('golden-divine-smite');
export const VoidGlitchLightning = createEffectComponent('void-glitch-lightning');
