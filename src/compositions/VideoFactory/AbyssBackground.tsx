import { useEffect, useMemo, useRef } from 'react';
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const PARTICLE_COUNT = 300; // Less dense than fire, more impactful individual particles

interface Particle3D {
  angle: number; // Angle in radians (cylinder)
  radius: number; // Distance from center (cylinder)
  y: number; // Vertical position
  speedY: number; // Upward speed
  speedRot: number; // Rotation speed
  size: number; // Base size
  opacity: number; // Base opacity
  color: string;
  wobbleFreq: number; // Frequency of turbulence
  wobbleAmp: number; // Amplitude of turbulence
}

type Props = {
  rank: number; // 1, 2, 3
};

export const AbyssBackground: React.FC<Props> = ({ rank }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Determine Theme Colors based on Rank
  const theme = useMemo(() => {
    if (rank === 1) return { baseHue: 50, sat: 100, light: 50, name: 'gold' }; // Gold
    if (rank === 2) return { baseHue: 210, sat: 10, light: 70, name: 'silver' }; // Silver (Blue-ish Grey)
    if (rank === 3) return { baseHue: 20, sat: 80, light: 50, name: 'bronze' }; // Bronze (Orange-Red)
    return { baseHue: 0, sat: 0, light: 100, name: 'white' };
  }, [rank]);

  // Initialize 3D particles
  const particles = useMemo(() => {
    const p: Particle3D[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Wide cylindrical spread
      const radius = random(`rad-${i}`) * 700 + 200;

      // Color variation
      const hueVar = (random(`hue-${i}`) - 0.5) * 20; // +/- 10 degrees hue
      const lightVar = (random(`lit-${i}`) - 0.5) * 40; // +/- 20% lightness

      p.push({
        angle: random(`ang-${i}`) * Math.PI * 2,
        radius: radius,
        y: random(`y-${i}`) * height,
        // Slower bubbling speed (Abyss like)
        speedY: random(`sy-${i}`) * 2 + 0.5,
        // Slow rotation
        speedRot: (random(`sr-${i}`) - 0.5) * 0.02,
        size: random(`sz-${i}`) * 15 + 2, // Varied sizes, some distinct orbs
        opacity: random(`op-${i}`) * 0.4 + 0.1, // Subtle opacity
        color: `hsl(${theme.baseHue + hueVar}, ${theme.sat}%, ${theme.light + lightVar}%)`,
        wobbleFreq: random(`wf-${i}`) * 0.05 + 0.01,
        wobbleAmp: random(`wa-${i}`) * 100 + 50, // Large swaying
      });
    }
    return p;
  }, [height, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Perspective Projection Settings
    const centerX = width / 2;
    const fov = 800;

    // Update and Draw Particles
    // 'screen' for glow, 'source-over' for smoke. 'lighter' works well for magic.
    ctx.globalCompositeOperation = 'lighter';

    particles.forEach((p) => {
      // Update Position
      const totalYShift = frame * p.speedY; // Continuous upward movement
      const totalRotShift = frame * p.speedRot; // Continuous rotation

      // Turbulent Wobble (Drifting effect)
      const turbulenceAngle = Math.sin(frame * p.wobbleFreq) * 0.2;
      const turbulenceY = Math.cos(frame * p.wobbleFreq * 1.5) * p.wobbleAmp;

      let currY = (p.y - totalYShift + turbulenceY) % (height + 400);
      if (currY < -200) currY += height + 400; // Loop vertically

      const currAngle = p.angle + totalRotShift + turbulenceAngle;

      // Convert Cylindrical to 3D Cartesian
      const x3d = Math.cos(currAngle) * p.radius;
      const z3d = Math.sin(currAngle) * p.radius;

      // Camera Transform
      const camZ = 1000;
      const projectedZ = camZ - z3d;

      if (projectedZ <= 0) return;

      const scale = fov / projectedZ;

      const screenX = centerX + x3d * scale;
      const screenY = currY;

      // Draw
      const drawnSize = p.size * scale;

      // Depth Fog
      const depthFade = Math.min(1, scale * 1.2);
      // Fade out at top/bottom edges
      const edgeFade = 1 - (Math.abs(currY - height / 2) / (height / 1.5)) ** 6;

      ctx.beginPath();
      ctx.arc(screenX, screenY, Math.max(0, drawnSize), 0, Math.PI * 2);

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity * depthFade * Math.max(0, edgeFade);
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
  }, [frame, width, height, particles]);

  return (
    <AbsoluteFill style={{ zIndex: 0 }}>
      {/* Gradient Background is handled by parent, but we can add a subtle overlay if needed */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      />
    </AbsoluteFill>
  );
};
