import React from 'react';
import { AbsoluteFill, interpolate, random } from 'remotion';

// --- Particle Emitter for the Magic Circle ---
const MagicParticles: React.FC<{ frame: number; color: string; count?: number }> = ({ 
  frame, 
  color, 
  count = 30 
}) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transformStyle: 'preserve-3d' }}>
      {new Array(count).fill(0).map((_, i) => {
        const seed = i * 123.456;
        const life = 50 + random(seed) * 50; // lifespan of particle
        const localFrame = (frame + seed * 100) % life;
        const progress = localFrame / life;
        
        // Circular spawn position
        const angle = random(seed + 1) * Math.PI * 2;
        const radius = 50 + random(seed + 2) * 200;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius; // Z represents depth on the floor mapping to Y visually later
        
        // Rise upwards (negative Y in CSS)
        const yOffset = interpolate(progress, [0, 1], [0, -400 - random(seed + 3) * 200]);
        const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
        const size = 2 + random(seed + 4) * 8;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size,
              height: size,
              backgroundColor: '#fff',
              borderRadius: '50%',
              boxShadow: `0 0 ${size * 2}px ${size}px ${color}`,
              transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${yOffset}px), ${z}px)`,
              opacity,
              mixBlendMode: 'plus-lighter',
            }}
          />
        );
      })}
    </div>
  );
};

// --- Giant Light Pillar Effect ---
const LightPillar: React.FC<{ frame: number; color: string; scaleProgress: number }> = ({ frame, color, scaleProgress }) => {
  const intensity = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.6, 1]);
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%', // the exact vertical center of the screen
      width: 1200 * scaleProgress, // ✨ Made 3 times wider! (was 400)
      height: 2000, // Very tall
      // Translate X to center horizontally. Translate Y by -100% to make it shoot UPWARDS from the top:50% point.
      transform: 'translate(-50%, -100%)',
      // The pillar is a cylinder of light fading at the edges
      background: `linear-gradient(90deg, transparent 0%, ${color} 30%, #fff 50%, ${color} 70%, transparent 100%)`,
      filter: 'blur(30px)',
      opacity: scaleProgress * intensity * 0.9,
      mixBlendMode: 'screen',
      clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)', // Tapers at the bottom
    }} />
  );
}


// --- Main Advanced Magic Circle Component ---
export const AdvancedMagicCircle: React.FC<{
  frame: number;
  color?: string; // e.g. '#00ffff'
  size?: number; // Base pixel size of the SVG
  tiltAngle?: number; // Angle it's laid flat on the ground (70deg is good)
  startDelay?: number; // How many frames before it starts drawing
  duration?: number; // How long it takes to fully draw
}> = ({ 
  frame, 
  color = '#00f3ff', 
  size = 800, 
  tiltAngle = 70,
  startDelay = 0,
  duration = 60,
}) => {
  // Animation Progress (0 to 1) for drawing the circle
  const activeFrame = Math.max(0, frame - startDelay);
  const drawProgress = interpolate(activeFrame, [0, duration], [0, 1], { extrapolateRight: 'clamp' });
  
  // Emojis/Runes for the outer rings
  const runes = "♅ ♆ ♇ ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ✦ ✵ ✹ ✶ ✴ ✳".repeat(3);
  const symbols = "⬡ ⬢ ⬣ ⬤ ⬥ ⬦ ⬥ ⬨ ⬩ ⬪ ⬫ ⬬ ⬭ ⬮ ⬯ ⭔ ⭓".repeat(3);

  // Rotations
  const rot1 = frame * 0.8;
  const rot2 = -frame * 0.5;
  const rot3 = frame * 1.2;

  // Pulse effect once fully drawn
  const pulse = drawProgress >= 1 ? 0.98 + 0.04 * Math.sin(frame * 0.1) : drawProgress;

  // Helper for drawing lines
  const getDrawStyles = (length: number) => ({
    strokeDasharray: length,
    strokeDashoffset: length * (1 - drawProgress),
  });

  return (
    <AbsoluteFill style={{ 
      perspective: '1500px', 
      overflow: 'visible', // Let light pillars escape bounds
    }}>
      
      {/* Container that tilts the entire floor */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        transform: `rotateX(${tiltAngle}deg)`,
        transformStyle: 'preserve-3d', // Important to pass 3D context to children so particles can rise in Z-space
      }}>
        
        {/* Glow behind the circle beneath the floor */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size * 1.2,
          height: size * 1.2,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
          opacity: drawProgress * 0.4,
          filter: 'blur(50px)',
          mixBlendMode: 'screen',
        }} />

        {/* --- THE SVG MAGIC CIRCLE --- */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size,
          height: size,
          transform: `translate(-50%, -50%)`, // Center it
          filter: `drop-shadow(0 0 20px ${color}) drop-shadow(0 0 50px ${color})`,
        }}>
          <svg width={size} height={size} viewBox="0 0 1000 1000">
            <defs>
              <filter id="adv_glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              
              {/* Paths for text rings */}
              <path id="runeRing1" d="M 500,500 m -450,0 a 450,450 0 1,1 900,0 a 450,450 0 1,1 -900,0" />
              <path id="runeRing2" d="M 500,500 m -350,0 a 350,350 0 1,1 700,0 a 350,350 0 1,1 -700,0" />
            </defs>

            {/* Background Base Ring */}
            <circle cx="500" cy="500" r="480" fill="none" stroke={color} strokeWidth="5" opacity="0.5" style={getDrawStyles(3016)} />
            <circle cx="500" cy="500" r="470" fill="none" stroke={color} strokeWidth="2" opacity="0.3" style={getDrawStyles(2954)} />
            
            {/* Outer Spinning Runes */}
            <g style={{ transform: `rotate(${rot1}deg)`, transformOrigin: '500px 500px', opacity: drawProgress }}>
              <text fontSize="28" fill={color} opacity="0.9" filter="url(#adv_glow)">
                <textPath href="#runeRing1" spacing="auto">{runes}</textPath>
              </text>
            </g>

            {/* Inner Spinning Symbols */}
            <g style={{ transform: `rotate(${rot2}deg)`, transformOrigin: '500px 500px', opacity: drawProgress }}>
              <text fontSize="22" fill={color} opacity="0.8">
                <textPath href="#runeRing2" spacing="auto">{symbols}</textPath>
              </text>
            </g>

            {/* Core Geometric Layer 1: Hexagrams (pulsing) */}
            <g style={{ transform: `rotate(${rot3}deg) scale(${pulse})`, transformOrigin: '500px 500px', filter: 'url(#adv_glow)' }}>
              {/* Outer Hexagram */}
              <polygon points="500,100 846,300 846,700 500,900 154,700 154,300" 
                fill="none" stroke={color} strokeWidth="8" opacity="0.7" style={getDrawStyles(2400)} />
              <polygon points="500,900 154,700 154,300 500,100 846,300 846,700" 
                fill="none" stroke={color} strokeWidth="4" opacity="0.5" style={getDrawStyles(2400)} />
              
              {/* Overlapping Triangles (Star of David) */}
              <polygon points="500,150 803,675 197,675" fill="none" stroke={color} strokeWidth="6" style={getDrawStyles(1800)} />
              <polygon points="500,850 803,325 197,325" fill="none" stroke={color} strokeWidth="6" style={getDrawStyles(1800)} />
            </g>

            {/* Core Geometric Layer 2: Inner Octagram */}
            <g style={{ transform: `rotate(${-rot1 * 1.5}deg) scale(${pulse * 0.8})`, transformOrigin: '500px 500px', filter: 'url(#adv_glow)' }}>
              <rect x="250" y="250" width="500" height="500" fill="none" stroke={color} strokeWidth="10" 
                style={getDrawStyles(2000)} />
              <rect x="250" y="250" width="500" height="500" fill="none" stroke={color} strokeWidth="10" 
                style={{ ...getDrawStyles(2000), transform: 'rotate(45deg)', transformOrigin: 'center' }} />
              
              {/* Inner Circle Base */}
              <circle cx="500" cy="500" r="220" fill="none" stroke={color} strokeWidth="8" style={getDrawStyles(1383)} />
              <circle cx="500" cy="500" r="180" fill="none" stroke={color} strokeWidth="4" strokeDasharray="20 10" opacity="0.8" style={getDrawStyles(1131)} />
              
              {/* Center Eye/Core */}
              <circle cx="500" cy="500" r="50" fill={color} opacity={0.6 * drawProgress} />
              <circle cx="500" cy="500" r="100" fill="none" stroke={color} strokeWidth="3" opacity={drawProgress} />
            </g>
          </svg>
        </div>

        {/* --- PARTICLE EMITTER --- */}
        {/* Because the floor container is rotated X 70deg, we need to counter-rotate the particles so they rise UP in world space 
            Alternatively, we position them in 3D using negative Z values to rise out of the floor. */}
        {drawProgress > 0.5 && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: `translate(-50%, -50%) rotateX(-${tiltAngle}deg)`, 
            transformStyle: 'preserve-3d' 
          }}>
            <MagicParticles frame={frame} color={color} count={80} />
          </div>
        )}

      </div>

      {/* --- LIGHT PILLAR (WORLD SPACE) --- */}
      {/* We render this OUTSIDE the tilted container so it simply shoots straight UP across the 2D screen naturally */}
      {drawProgress > 0.8 && (
        <LightPillar frame={frame} color={color} scaleProgress={drawProgress} />
      )}

    </AbsoluteFill>
  );
};
