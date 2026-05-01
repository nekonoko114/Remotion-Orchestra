import { VideoEffectRecipe } from './VideoEffectBuilder';

// Pixabay base videos we currently have downloaded:
// 'assets/pixabay/videos/webm/fire-flower01.webm'
// 'assets/pixabay/videos/webm/fire-explotion.webm'

export const EffectCatalog: VideoEffectRecipe[] = [
  {
    id: 'base-fire',
    name: 'Normal Fire',
    src: 'assets/pixabay/videos/webm/fire-flower01.webm',
    blendMode: 'screen',
    opacity: 0.8,
  },
  {
    id: 'blue-ghost-fire',
    name: 'Ghostly Blue Fire',
    src: 'assets/pixabay/videos/webm/fire-flower01.webm',
    blendMode: 'screen',
    hueRotate: 200, // Shifts orange to blue/cyan
    saturation: 150,
    blur: 2,
    opacity: 0.9,
  },
  {
    id: 'toxic-green-fire',
    name: 'Toxic Green Burn',
    src: 'assets/pixabay/videos/webm/fire-flower01.webm',
    blendMode: 'plus-lighter', // Additive
    hueRotate: 80, // Shifts orange to green
    contrast: 150,
    brightness: 120,
    opacity: 0.85,
  },
  {
    id: 'noisy-explosion',
    name: 'Glitching Explosion',
    src: 'assets/pixabay/videos/webm/fire-explotion.webm',
    blendMode: 'screen',
    noiseIntensity: 0.8,
    noiseScale: 0.05, // fine static noise
    hueRotate: 300, // pinkish/purple explosion
    saturation: 200,
    opacity: 1,
  },
  {
    id: 'dark-magic-blast',
    name: 'Dark Magic Invert',
    src: 'assets/pixabay/videos/webm/fire-explotion.webm',
    blendMode: 'difference', // Inverts underlying colors
    invert: 100, // Invert the fire itself (turns black/blue)
    contrast: 200,
    opacity: 0.9,
  },
  {
    id: 'heavy-blur-glow',
    name: 'Soft Ambient Glow',
    src: 'assets/pixabay/videos/webm/fire-flower01.webm',
    blendMode: 'screen',
    blur: 15, 
    opacity: 0.5,
    hueRotate: -45, 
  },
  {
    id: 'thunder-strike-cyan',
    name: 'Cyan Lightning Storm',
    src: 'assets/pixabay/videos/webm/lightning-holizon.webm',
    blendMode: 'screen',
    hueRotate: 180, // turn to blue/cyan
    saturation: 150,
    contrast: 120,
    opacity: 0.9,
  },
  {
    id: 'crimson-overcharge-lightning',
    name: 'Crimson Overcharge',
    src: 'assets/pixabay/videos/webm/lightning-holizon.webm',
    blendMode: 'screen',
    hueRotate: -60, // turn to red/crimson
    saturation: 250,
    contrast: 150,
    playbackRate: 1.5, // 1.5倍速で激しく
    scale: 1.2, // 少しズームして迫力を出す
    opacity: 1,
  },
  {
    id: 'golden-divine-smite',
    name: 'Judgement Lightning',
    src: 'assets/pixabay/videos/webm/lightning-holizon.webm',
    blendMode: 'plus-lighter',
    hueRotate: -150, // turn to gold/yellow
    saturation: 150,
    brightness: 130,
    blur: 2, // 神聖な光のようにぼかす
    noiseIntensity: 0.1,
    scale: 1.1,
    opacity: 0.9,
  },
  {
    id: 'void-glitch-lightning',
    name: 'Void Glitch Storm',
    src: 'assets/pixabay/videos/webm/lightning-holizon.webm',
    blendMode: 'screen',
    hueRotate: 280, // turn to purple
    contrast: 200,
    noiseIntensity: 0.8, // 激しいグリッチノイズ
    noiseScale: 0.05,
    playbackRate: 1.8, // かなり速く
    scale: 1.3, // さらにズーム
  },
  {
    id: 'bokeh-dream-pink',
    name: 'Pink Bokeh Dream',
    src: 'assets/pixabay/videos/webm/boken-ball.webm',
    blendMode: 'screen',
    hueRotate: -60, // turn to pink/magenta
    blur: 4, // soften the bokeh
    opacity: 0.8,
  },
  {
    id: 'rainbow-glitch-particles',
    name: 'Cyber Rainbow Glitch',
    src: 'assets/pixabay/videos/webm/particle-reibow-mix.webm',
    blendMode: 'plus-lighter',
    noiseIntensity: 0.6,
    noiseScale: 0.02,
    saturation: 300,
    contrast: 150,
  },
  {
    id: 'dark-matter-abstract',
    name: 'Dark Matter Waves',
    src: 'assets/pixabay/videos/webm/abstruct01.webm',
    blendMode: 'difference', // Abstract dark inversion
    invert: 80,
    hueRotate: 90,
    opacity: 0.9,
  },
  {
    id: 'golden-stardust',
    name: 'Golden Stardust',
    src: 'assets/pixabay/videos/webm/priticle-absturact-gold.webm',
    blendMode: 'screen',
    saturation: 150,
    brightness: 120,
    opacity: 1,
  },
  {
    id: 'cyber-tunnel-green',
    name: 'Toxic Cyber Tunnel',
    src: 'assets/pixabay/videos/webm/absturact-turing.webm',
    blendMode: 'screen',
    hueRotate: 250, // shift to green
    contrast: 150,
    opacity: 0.7,
  },
  {
    id: 'five-element-surge',
    name: 'Five Element Surge',
    src: 'assets/pixabay/videos/webm/five-element-explosion.webm',
    blendMode: 'screen',
    saturation: 200,
    contrast: 120,
    opacity: 1,
  },
  {
    id: 'deep-space-bokeh',
    name: 'Deep Space Anomaly',
    src: 'assets/pixabay/videos/webm/boken-litflare-horaizon.webm',
    blendMode: 'screen',
    blur: 5,
    hueRotate: 200, // turn to deep blue/cyan
    saturation: 150,
    opacity: 0.9,
  },
  {
    id: 'cursed-fire-fragment',
    name: 'Cursed Fragment',
    src: 'assets/pixabay/videos/webm/firele-flagment.webm',
    blendMode: 'difference', // Abstract inversion effect
    invert: 100,
    hueRotate: 45,
    saturation: 200,
    opacity: 0.9,
  },
  {
    id: 'neon-rpg-stroke',
    name: 'Neon RPG Aura',
    src: 'assets/pixabay/videos/webm/outline-storke-rpg.webm',
    blendMode: 'screen',
    hueRotate: 240, // shift to intense blue/purple
    saturation: 300,
    brightness: 150,
    opacity: 1,
  },
  {
    id: 'particle-fire-storm',
    name: 'Ember Storm',
    src: 'assets/pixabay/videos/webm/partickle-fire.webm',
    blendMode: 'screen',
    blur: 2,
    brightness: 120,
    opacity: 0.8,
  },
  {
    id: 'magical-circle-aura',
    name: 'Eldritch Magic Circle',
    src: 'assets/pixabay/videos/webm/circle-stoken.webm',
    blendMode: 'screen',
    hueRotate: -90, // shift to pink/red
    blur: 1,
    brightness: 150,
    opacity: 0.95,
  },
  {
    id: 'green-plasma-field',
    name: 'Plasma Field',
    src: 'assets/pixabay/videos/webm/pixabay_particles_light_beautiful_wallpaper_green_wallpape_202587.webm',
    blendMode: 'plus-lighter',
    contrast: 200,
    hueRotate: 45, // shift to cyan
    opacity: 0.8,
  },
  {
    id: 'holy-star-glow',
    name: 'Holy Star Glow',
    src: 'assets/pixabay/videos/webm/pixabay_stars_christmas_loop_glowing_light_background_beau_183279.webm',
    blendMode: 'screen',
    blur: 4,
    hueRotate: -30, // warm golden
    saturation: 150,
    opacity: 0.9,
  },
  {
    id: 'rainbow-infinity-light',
    name: 'Infinity Prism Light',
    src: 'assets/pixabay/videos/webm/abstruct-rainbow.webm',
    blendMode: 'screen',
    saturation: 300,
    contrast: 150,
    opacity: 1,
  },
  {
    id: 'glitching-abstract-wave',
    name: 'Corrupted Waveform',
    src: 'assets/pixabay/videos/webm/abstruct01.webm',
    blendMode: 'plus-lighter',
    noiseIntensity: 0.9,
    noiseScale: 0.1,
    hueRotate: 180,
    opacity: 0.9,
  }
];
