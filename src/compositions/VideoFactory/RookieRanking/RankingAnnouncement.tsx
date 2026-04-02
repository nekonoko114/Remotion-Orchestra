import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { HalftoneBackground, SpeedLines, AmecomiTextStyle } from './AmecomiElements';
import { useBeat, BeatShake, GlitchOverlay } from './BeatSync';

// 3D Medal/Coin Component
const Medal3D: React.FC<{ color: string; rank: number; bpm: number }> = ({ color, rank, bpm }) => {
  const frame = useCurrentFrame();
  const { kickStrength } = useBeat(bpm);
  const rotation = (frame * 2 * Math.PI) / 120;

  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(3, 3, 0.5, 32);
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1 + kickStrength * 2} />
      <mesh geometry={geometry} rotation={[Math.PI / 2, rotation, 0]} scale={1 + kickStrength * 0.1}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.1} 
          emissive={color} 
          emissiveIntensity={0.5 + kickStrength * 3} 
        />
      </mesh>
    </>
  );
};

export const RankingAnnouncement: React.FC<{ rank: number, color: string, name?: string, duration: number, bpm?: number }> = ({ rank, color, name = "USER NAME", duration, bpm = 160 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { kickStrength } = useBeat(bpm);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const baseScale = interpolate(entrance, [0, 1], [0, 1.2]);
  
  // Final Zoom: At the last 15 frames, scale up massively to 2.5x
  const finalZoom = interpolate(
    frame,
    [duration - 15, duration],
    [1, 2.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const textScale = (baseScale + kickStrength * 0.1) * finalZoom;
  const rankImage = rank === 1 
    ? "assets/images/gold.svg" 
    : rank === 2 
      ? "assets/images/silver.svg" 
      : "assets/images/copper.svg";

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        {/* Background Effects (Translucent) */}
        <AbsoluteFill style={{ transform: `scale(${finalZoom})` }}>
          <HalftoneBackground color={rank === 1 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(26, 26, 46, 0.5)'} />
          <SpeedLines />
        </AbsoluteFill>

        {/* 3D Medal */}
        <AbsoluteFill style={{ zIndex: 5, transform: `scale(${finalZoom})` }}>
          <ThreeCanvas width={width} height={height}>
            <Medal3D color={color} rank={rank} bpm={bpm} />
          </ThreeCanvas>
        </AbsoluteFill>

        {/* Rank Image (Centered & Pulsing) */}
        <div style={{
          position: 'absolute',
          left: "50%",
          transform: `translateX(-50%) scale(${textScale})`,
          top: 100,
          width: 500,
          height: 180,
          zIndex: 10,
          filter: `drop-shadow(0 0 ${30 + kickStrength * 50}px ${color})`,
        }}>
          <Img src={staticFile(rankImage)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Profile Frame */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${textScale})`,
          width: 550,
          height: 550,
          borderRadius: 40,
          border: `15px solid black`,
          backgroundColor: '#111',
          boxShadow: `0 0 ${40 + kickStrength * 60}px ${color}, 15px 15px 0px rgba(0,0,0,0.5)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 6,
        }}>
          <div style={{ 
            fontSize: 40, 
            color: color, 
            fontWeight: 'bold', 
            textAlign: 'center',
            opacity: 0.5 + kickStrength * 0.5
          }}>
            PHOTO<br/>OR<br/>VIDEO
          </div>
        </div>

        {/* Name Label */}
        <div style={{
          position: 'absolute',
          bottom: 220,
          left: '50%',
          transform: `translateX(-50%) scale(${textScale}) rotate(-1deg)`,
          backgroundColor: color,
          padding: '20px 100px',
          border: '12px solid black',
          boxShadow: '20px 20px 0px rgba(0,0,0,0.5)',
          zIndex: 20,
        }}>
          <span style={{
            ...AmecomiTextStyle,
            fontSize: 90,
            color: 'black',
            WebkitTextStroke: '0px',
            textShadow: 'none',
            textTransform: 'uppercase',
          }}>
            {name}
          </span>
        </div>
      </BeatShake>
    </AbsoluteFill>
  );
};
