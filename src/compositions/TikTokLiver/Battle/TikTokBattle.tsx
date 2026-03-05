import type React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { AdaptiveContainer } from '../../../components/TikTok/AdaptiveContainer';
import { HyperShake } from '../../../components/effects/HyperShake';
import { ImpactShockwave } from '../../../components/effects/ImpactShockwave';
import { KineticText } from '../../../components/effects/KineticText';
import { EnergyBolts } from '../../../components/overlays/EnergyBolts';
import { SpeedLines } from '../../../components/overlays/SpeedLines';
import { FlashTransition } from '../../../components/transitions/FlashTransition';
import { HyperSpinTransition } from '../../../components/transitions/HyperSpinTransition';

const LiverSide = ({
  name,
  color,
  side,
}: { name: string; color: string; side: 'left' | 'right' }) => {
  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRight: side === 'left' ? '4px solid #fff' : 'none',
      }}
    >
      <div
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          border: '10px solid #fff',
          backgroundColor: '#333',
          backgroundImage: 'linear-gradient(45deg, #444, #222)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '120px',
        }}
      >
        {side === 'left' ? '🐱' : '🦊'}
      </div>
      <h2
        style={{
          color: '#fff',
          fontSize: '60px',
          fontWeight: '900',
          marginTop: '40px',
        }}
      >
        {name}
      </h2>
    </div>
  );
};

export const TikTokBattle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AdaptiveContainer>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <Series>
          {/* 1. INTRO SPIN */}
          <Series.Sequence durationInFrames={45}>
            <HyperSpinTransition type="in">
              <AbsoluteFill
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#111',
                }}
              >
                <KineticText
                  text="LIVE BATTLE"
                  style={{
                    fontSize: '120px',
                    color: '#ff2d55',
                    fontWeight: '950',
                  }}
                />
              </AbsoluteFill>
            </HyperSpinTransition>
          </Series.Sequence>

          {/* 2. THE BATTLE (EXTREME) */}
          <Series.Sequence durationInFrames={150}>
            <HyperShake intensity={interpolate(frame % 30, [0, 30], [2, 10])}>
              <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <LiverSide name="KURUMI" color="#FF2D55" side="left" />
                <LiverSide name="MELL" color="#007AFF" side="right" />
              </div>

              {/* Constant high-energy overlays */}
              <EnergyBolts />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <h1
                  style={{
                    fontSize: '200px',
                    color: '#fff',
                    fontWeight: '950',
                    textShadow: '0 0 50px #000',
                  }}
                >
                  VS
                </h1>
              </div>

              {/* Periodic Shockwaves */}
              {frame % 45 === 0 && <ImpactShockwave />}
              {frame % 60 === 0 && <FlashTransition duration={10} />}
              <SpeedLines count={60} color="white" />
            </HyperShake>
          </Series.Sequence>

          {/* 3. FINISHER */}
          <Series.Sequence durationInFrames={60}>
            <HyperSpinTransition type="out">
              <AbsoluteFill
                style={{
                  backgroundColor: '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HyperShake intensity={5}>
                  <h1
                    style={{
                      fontSize: '150px',
                      color: '#000',
                      fontWeight: '950',
                    }}
                  >
                    WINNER!!
                  </h1>
                </HyperShake>
              </AbsoluteFill>
            </HyperSpinTransition>
          </Series.Sequence>
        </Series>

        {/* Global Overlays */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: '10px 40px',
              borderRadius: '40px',
              color: '#fff',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            BATTLE MODE: ACTIVE
          </div>
        </div>
      </AbsoluteFill>
    </AdaptiveContainer>
  );
};

import { Series } from 'remotion';
