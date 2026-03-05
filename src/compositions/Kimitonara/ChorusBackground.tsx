import React, { useEffect, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { gsap } from 'gsap';

export const ChorusBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // God Rays (光の筋) の回転
      gsap.to('.god-ray', {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center center',
      });

      // パーティクルの浮遊
      gsap.to('.gold-particle', {
        y: -height,
        duration: 'random(2, 5)',
        repeat: -1,
        ease: 'none',
        stagger: {
          amount: 5,
          from: 'random',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [height]);

  // God Raysの生成
  const rays = Array.from({ length: 12 }).map((_, i) => {
    const rotation = (i * 360) / 12;
    return (
      <div
        key={`ray-${i}`}
        className="god-ray"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '200%', // 画面より大きく
          height: '200px',
          // Cool Blue/Cyan Rays
          background:
            'linear-gradient(90deg, rgba(100,200,255,0) 0%, rgba(100,200,255,0.2) 50%, rgba(100,200,255,0) 100%)',
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          filter: 'blur(20px)',
          transformOrigin: 'center center',
        }}
      />
    );
  });

  // 青/白のパーティクル
  const particles = Array.from({ length: 30 }).map((_, i) => (
    <div
      key={`particle-${i}`}
      className="gold-particle"
      style={{
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: `${100 + Math.random() * 20}%`, // 画面の下から
        width: `${Math.random() * 5 + 2}px`,
        height: `${Math.random() * 5 + 2}px`,
        // Cyan/White glow
        background:
          'radial-gradient(circle, #fff 0%, #00ffff 60%, transparent 100%)',
        boxShadow: '0 0 10px #00ffff',
        borderRadius: '50%',
        opacity: Math.random() * 0.7 + 0.3,
      }}
    />
  ));

  return (
    <AbsoluteFill
      ref={containerRef}
      style={{
        // Deep Blue / Purple / Cyber Background
        background:
          'radial-gradient(circle at center, #2a004f 0%, #1a0033 40%, #000000 100%)',
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          mixBlendMode: 'screen',
        }}
      >
        {rays}
      </div>

      <AbsoluteFill style={{ mixBlendMode: 'overlay' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 30%, black 100%)', // ビネット
          }}
        />
      </AbsoluteFill>

      {particles}

      {/* 全体的な輝き (Blue tint) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(100,100,255,0.2) 0%, transparent 70%)',
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};
