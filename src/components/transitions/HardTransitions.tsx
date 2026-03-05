import type React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from 'remotion';
import type { TransitionProps } from '../../types/transitions';

// --- 共通ヘルパー: 劇烈な演出のための計算 ---

// 1. インパクト・フレーム: 指定区間だけ真っ白にする
const renderImpactFlash = (progress: number, impactPoint = 0.5) => {
  // 衝撃の瞬間の前後0.05だけ真っ白
  const flashOpacity = interpolate(
    progress,
    [impactPoint - 0.05, impactPoint, impactPoint + 0.15],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  if (flashOpacity <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        opacity: flashOpacity,
        mixBlendMode: 'overlay',
        zIndex: 100,
      }}
    />
  );
};

// 2. 激しい揺れ (Seismic Shake)
const calculateShake = (progress: number, intensity: number) => {
  // 中央(0.5)で最大になるランダムな揺れ
  const shakeAmount = interpolate(
    Math.abs(progress - 0.5),
    [0, 0.5],
    [intensity, 0],
  );
  const x = (random(`x-${progress}`) - 0.5) * shakeAmount;
  const y = (random(`y-${progress}`) - 0.5) * shakeAmount;
  return { x, y };
};

// --- 1. SEISMIC IMPACT SLAM (物理・衝撃) ---
export const SeismicImpactSlam: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames); // 0 -> 1

  const shake = calculateShake(progress, 100);

  // 前半はFrom、後半はToを表示
  // Scale: 衝突の瞬間に少し大きくなって戻る（呼吸感）
  const scale = interpolate(
    progress,
    [0, 0.4, 0.5, 0.6, 1],
    [1, 1.1, 1.4, 1.1, 1],
  );

  const currentScene = progress < 0.5 ? from : to;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate3d(${shake.x}px, ${shake.y}px, 0) scale(${scale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {currentScene}
      </div>
      {renderImpactFlash(progress, 0.5)}
    </AbsoluteFill>
  );
};

// --- 2. HYPERDRIVE SINGULARITY (光学・崩壊) ---
export const HyperdriveSingularity: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  // イージング: 急激に加速して吸い込まれる
  const ease = Easing.bezier(0.8, 0, 0.2, 1);
  const t = ease(progress); // 0 -> 1

  // Zoom: 1 -> 0 (吸い込まれ) / 0 -> 1 (出現)
  const scaleFrom = interpolate(t, [0, 0.5], [1, 0.01], {
    extrapolateRight: 'clamp',
  });
  const scaleTo = interpolate(t, [0.5, 1], [20, 1], {
    extrapolateLeft: 'clamp',
  });

  // 光の筋 (Stretch): 高速移動時の光の伸び
  const blurAmount = interpolate(Math.abs(t - 0.5), [0, 0.5], [20, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {t < 0.5 ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${scaleFrom}) translate3d(0, 0, 0)`,
            filter: `blur(${blurAmount}px) brightness(${1 + blurAmount / 5})`,
            transformOrigin: 'center center',
            willChange: 'transform, filter',
          }}
        >
          {from}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${scaleTo}) translate3d(0, 0, 0)`,
            filter: `blur(${blurAmount}px) brightness(${1 + blurAmount / 5})`,
            transformOrigin: 'center center',
            willChange: 'transform, filter',
          }}
        >
          {to}
        </div>
      )}
      {/* 特異点の光 */}
      {t > 0.4 && t < 0.6 && (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)',
            mixBlendMode: 'screen',
            transform: `scale(${interpolate(t, [0.4, 0.5, 0.6], [0, 2, 0])}) translate3d(0, 0, 0)`,
            willChange: 'transform',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// --- 3. NEURAL GLITCH OVERLOAD (デジタル・汚染) ---
export const NeuralGlitchOverload: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 25,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const intensity = interpolate(Math.sin(progress * Math.PI), [0, 1], [0, 30]);

  const currentContent = progress < 0.5 ? from : to;
  const noiseY = random(frame) * 100 - 50;

  // Deterministic random direction
  const rDir = random(`r-dir-${frame}`) > 0.5 ? 1 : -1;
  const bDir = random(`b-dir-${frame}`) > 0.5 ? 1 : -1;

  // Optimization: Use a single SVG filter for RGB split instead of triple-rendering
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <title>RGB Split Filter</title>
        <filter id="neural-rgb-split">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          <feOffset in="red" dx={intensity * rDir} dy="0" result="redOffset" />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="green"
          />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />
          <feOffset
            in="blue"
            dx={-intensity * bDir}
            dy="0"
            result="blueOffset"
          />
          <feBlend in="redOffset" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueOffset" mode="screen" />
        </filter>
      </svg>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          filter: 'contrast(1.5) url(#neural-rgb-split)',
          willChange: 'filter',
        }}
      >
        <AbsoluteFill>{currentContent}</AbsoluteFill>
      </div>

      {/* White/Black Flash Strips */}
      {intensity > 10 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: 20,
            backgroundColor: 'white',
            transform: `translate3d(0, ${noiseY}vh, 0)`,
            mixBlendMode: 'difference',
            willChange: 'transform',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// --- 4. VORTEX SHREDDER (空間・次元) ---
export const VortexShredder: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 40,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const rotation = interpolate(progress, [0, 1], [0, 720]);
  const scale = interpolate(progress, [0, 0.5, 1], [1, 0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {progress < 0.5 ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${scale}) rotate(${rotation}deg) translate3d(0, 0, 0)`,
            filter: `blur(${interpolate(progress, [0, 0.5], [0, 20])}px)`,
            opacity: interpolate(progress, [0.4, 0.5], [1, 0]),
            willChange: 'transform, opacity, filter',
          }}
        >
          {from}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${scale}) rotate(${rotation}deg) translate3d(0, 0, 0)`,
            filter: `blur(${interpolate(progress, [0.5, 1], [20, 0])}px)`,
            opacity: interpolate(progress, [0.5, 0.6], [0, 1]),
            willChange: 'transform, opacity, filter',
          }}
        >
          {to}
        </div>
      )}
    </AbsoluteFill>
  );
};

// --- 5. SOLAR PROMINENCE BURST (光学・崩壊) ---
export const SolarProminenceBurst: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 25,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const intensity = interpolate(progress, [0, 0.5, 1], [0, 1, 0]);
  const flareColor = 'rgba(255, 200, 50, 0.8)';

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          opacity: progress < 0.5 ? 1 : 0,
          transform: `scale(${1 + intensity * 0.2}) translate3d(0, 0, 0)`,
          filter: `brightness(${1 + intensity * 5}) sepia(${intensity}) saturate(${intensity * 3}) blur(${intensity * 10}px)`,
          willChange: 'transform, filter, opacity',
        }}
      >
        {from}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: progress >= 0.5 ? 1 : 0,
          transform: `scale(${1 + intensity * 0.2}) translate3d(0, 0, 0)`,
          filter: `brightness(${1 + intensity * 5}) sepia(${intensity}) saturate(${intensity * 3}) blur(${intensity * 10}px)`,
          willChange: 'transform, filter, opacity',
        }}
      >
        {to}
      </div>

      {/* プロミネンス（光の爆発） */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, ${flareColor} 0%, rgba(255,100,0,0) 70%)`,
          opacity: intensity,
          mixBlendMode: 'screen',
          transform: `scale(${1 + intensity}) translate3d(0, 0, 0)`,
          willChange: 'transform, opacity',
        }}
      />
    </AbsoluteFill>
  );
};

// --- 6. ABYSS GRAVITY FALL (空間・次元) ---
export const AbyssGravityFall: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);
  const ease = Easing.exp;
  const t = ease(progress);

  const stretchFrom = interpolate(t, [0, 1], [1, 5]);
  const transYFrom = interpolate(t, [0, 1], [0, 1080]);

  const stretchTo = interpolate(t, [0, 1], [5, 1]);
  const transYTo = interpolate(t, [0, 1], [-1080, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {t < 0.5 ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `translate3d(0, ${transYFrom}px, 0) scaleY(${stretchFrom}) scaleX(${1 / stretchFrom})`,
            filter: `brightness(${1 - t}) blur(${t * 20}px)`,
            transformOrigin: 'bottom center',
            willChange: 'transform, filter',
          }}
        >
          {from}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `translate3d(0, ${transYTo}px, 0) scaleY(${stretchTo}) scaleX(${1 / stretchTo})`,
            filter: `brightness(${t}) blur(${(1 - t) * 20}px)`,
            transformOrigin: 'top center',
            willChange: 'transform, filter',
          }}
        >
          {to}
        </div>
      )}
    </AbsoluteFill>
  );
};

// --- 7. DIMENSIONAL RIFT TEAR (空間・次元) ---
export const DimensionalRiftTear: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 25,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const shiftX = interpolate(progress, [0, 0.5, 1], [0, 100, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${interpolate(progress, [0, 0.5, 1], [1.5, 1, 1])}) translate3d(0, 0, 0)`,
          filter: `brightness(${interpolate(progress, [0, 0.5, 1], [0, 1, 1])})`,
          willChange: 'transform, filter',
        }}
      >
        {to}
      </AbsoluteFill>

      {progress < 0.8 && (
        <>
          <AbsoluteFill
            style={{
              clipPath: 'polygon(0 0, 40% 0, 60% 100%, 0% 100%)',
              transform: `translate3d(-${shiftX}px, 0, 0) rotate(-${shiftX * 0.05}deg)`,
              filter: `brightness(${1 - progress})`,
              willChange: 'transform, filter',
            }}
          >
            {from}
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 60% 100%)',
              transform: `translate3d(${shiftX}px, 0, 0) rotate(${shiftX * 0.05}deg)`,
              filter: `brightness(${1 - progress})`,
              willChange: 'transform, filter',
            }}
          >
            {from}
          </AbsoluteFill>
        </>
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '40%',
          width: '20%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #fff, transparent)',
          opacity: interpolate(progress, [0, 0.1, 0.3], [0, 1, 0]),
          mixBlendMode: 'screen',
          transform: 'skewX(20deg)',
          willChange: 'opacity',
        }}
      />
    </AbsoluteFill>
  );
};

// --- 8. CYBER PUNCTURE (有機・侵食) ---
export const CyberPuncture: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const maskSize = interpolate(progress, [0, 1], [0, 150]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{to}</AbsoluteFill>

      <AbsoluteFill
        style={{
          maskImage: `radial-gradient(circle at center, transparent ${maskSize}%, black ${maskSize + 10}%)`,
          WebkitMaskImage: `radial-gradient(circle at center, transparent ${maskSize}%, black ${maskSize + 10}%)`,
          transform: `scale(${1 + progress * 0.5}) translate3d(0, 0, 0)`,
          willChange: 'transform',
        }}
      >
        {from}
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vmax',
          height: '100vmax',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'transparent',
          boxShadow: 'inset 0 0 50px #00ff00',
          pointerEvents: 'none',
          opacity: interpolate(progress, [0, 0.8, 1], [1, 1, 0]),
          zIndex: 10,
          willChange: 'opacity',
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.1) 4px)',
          pointerEvents: 'none',
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};

// --- 9. KINETIC CRASH BOUNCE (物理・衝撃) ---
export const KineticCrashBounce: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 25,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const bounce = interpolate(
    progress,
    [0, 0.4, 0.6, 0.8, 1],
    [0, 1.2, 0.95, 1.05, 1],
    { extrapolateRight: 'clamp' },
  );

  const impactScale = interpolate(progress, [0.3, 0.4, 0.6], [1, 1.2, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate3d(${(1 - bounce) * -100}%, 0, 0) scale(${impactScale})`,
          filter: `blur(${interpolate(bounce, [0, 1], [30, 0])}px)`,
          willChange: 'transform, filter',
        }}
      >
        {to}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate3d(${bounce * 100}%, 0, 0) rotate(${bounce * 10}deg)`,
          opacity: progress > 0.5 ? 0 : 1,
          willChange: 'transform, opacity',
        }}
      >
        {from}
      </div>
    </AbsoluteFill>
  );
};

// --- 10. TECTONIC PLATE SHIFT (物理・衝撃) ---
export const TectonicPlateShift: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const shift = interpolate(progress, [0, 1], [0, 100]);
  const vibration = Math.sin(frame * 2) * 5 * (1 - progress);

  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '50%',
          overflow: 'hidden',
          transform: `translate3d(${shift}%, ${vibration}px, 0)`,
          willChange: 'transform',
        }}
      >
        <div style={{ marginTop: 0 }}>{from}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '50%',
          overflow: 'hidden',
          transform: `translate3d(-${shift}%, ${-vibration}px, 0)`,
          willChange: 'transform',
        }}
      >
        <div style={{ marginTop: '-540px' }}>{from}</div>
      </div>

      <AbsoluteFill
        style={{
          zIndex: -1,
          transform: `scale(${1.2 - progress * 0.2}) translate3d(0, 0, 0)`,
          willChange: 'transform',
        }}
      >
        {to}
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          top: '48%',
          left: 0,
          width: '100%',
          height: '4%',
          background: 'linear-gradient(90deg, #ff0000, #ffff00, #ff0000)',
          opacity: interpolate(progress, [0, 0.5, 1], [0, 1, 0]),
          filter: 'blur(10px)',
          mixBlendMode: 'screen',
          willChange: 'opacity',
        }}
      />
    </AbsoluteFill>
  );
};

// --- 11. PRISM SHATTER BLAST (光学・崩壊) ---
export const PrismShatterBlast: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 25,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);
  const shards = 6;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{to}</AbsoluteFill>

      {progress < 1 &&
        Array.from({ length: shards }).map((_, i) => {
          const angle = (i / shards) * Math.PI * 2;
          const distance = interpolate(progress, [0, 1], [0, 1500]);
          const rotate = interpolate(
            progress,
            [0, 1],
            [0, 180 + random(i) * 180],
          );

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                clipPath: `polygon(50% 50%, ${50 + 100 * Math.cos(angle)}% ${50 + 100 * Math.sin(angle)}%, ${50 + 100 * Math.cos(angle + 1)}% ${50 + 100 * Math.sin(angle + 1)}%)`,
                transform: `translate3d(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px, 0) rotate(${rotate}deg)`,
                opacity: 1 - progress,
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                willChange: 'transform, opacity',
              }}
            >
              {from}
            </div>
          );
        })}
      {renderImpactFlash(progress, 0.1)}
    </AbsoluteFill>
  );
};

// --- 12. QUANTUM PHASE DISRUPTION (デジタル・汚染) ---
export const QuantumPhaseDisruption: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const instability = interpolate(Math.abs(progress - 0.5), [0, 0.5], [1, 0]);
  const showFrom = random(`vis-from-${frame}`) > instability;
  const shiftX = (random(`qx-${frame}`) - 0.5) * 200 * instability;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          opacity: showFrom ? 1 : 0.2,
          transform: `translate3d(${shiftX}px, 0, 0)`,
          filter: `invert(${random(`inv-${frame}`) > 0.9 ? 1 : 0}) hue-rotate(${random(`hue-${frame}`) * 360}deg)`,
          mixBlendMode: 'difference',
          willChange: 'transform, filter, opacity',
        }}
      >
        {progress < 0.5 ? from : to}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.5,
          transform: `scale(${1 + instability * 0.5}) translate3d(0, 0, 0)`,
          mixBlendMode: 'screen',
          filter: 'blur(10px)',
          willChange: 'transform',
        }}
      >
        {progress < 0.5 ? from : to}
      </div>
    </AbsoluteFill>
  );
};

// --- 13. DATA VOID INFERNO (デジタル・汚染) ---
export const DataVoidInferno: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);
  const blocks = 8;
  const blockSize = 100 / blocks;

  return (
    <AbsoluteFill>
      {from}

      {Array.from({ length: 40 }).map((_, i) => {
        const seed = random(i);
        const appearTime = seed * 0.5;
        if (progress < appearTime) return null;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(seed * 100) % 100}%`,
              top: `${(random(i + 1) * 100) % 100}%`,
              width: `${blockSize * 2}%`,
              height: `${blockSize * 2}%`,
              backgroundColor: '#000',
              transform: `scale(${progress > 0.5 ? (progress - 0.5) * 10 : 1}) translate3d(0, 0, 0)`,
              willChange: 'transform',
            }}
          />
        );
      })}

      {progress > 0.8 && <AbsoluteFill>{to}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// --- 14. MAGMATIC MELTDOWN (有機・侵食) ---
export const MagmaticMeltdown: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 40,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);

  const melt = interpolate(progress, [0, 1], [0, 1000]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#220000' }}>
      <AbsoluteFill>{to}</AbsoluteFill>

      <AbsoluteFill
        style={{
          transform: `translate3d(0, ${melt}px, 0) scaleY(${1 + progress})`,
          filter: `contrast(2) blur(${progress * 20}px) hue-rotate(-30deg)`,
          opacity: 1 - progress,
          willChange: 'transform, filter, opacity',
        }}
      >
        {from}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50%',
            background: 'linear-gradient(to top, #ff9900, transparent)',
            mixBlendMode: 'color-dodge',
            opacity: 0.8,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- 15. GHOST ECHO TRAIL (有機・侵食) ---
export const GhostEchoTrail: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / durationInFrames);
  const echos = 5;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>
        <div
          style={{
            opacity: 1 - progress,
            transform: `scale(${1 + progress}) translate3d(0, 0, 0)`,
            willChange: 'transform, opacity',
          }}
        >
          {from}
        </div>
      </AbsoluteFill>
      <AbsoluteFill>
        <div
          style={{
            opacity: progress,
            transform: `scale(${2 - progress}) translate3d(0, 0, 0)`,
            willChange: 'transform, opacity',
          }}
        >
          {to}
        </div>
      </AbsoluteFill>

      {Array.from({ length: echos }).map((_, i) => {
        const lag = i * 0.05;
        const echoProgress = Math.max(0, progress - lag);
        if (echoProgress <= 0 || echoProgress >= 1) return null;

        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity: 0.3,
              mixBlendMode: 'screen',
              transform: `scale(${1 + echoProgress * 0.2}) translate3d(${Math.sin(echoProgress * 10) * 50}px, 0, 0)`,
              filter: `blur(5px) hue-rotate(${i * 30}deg)`,
              willChange: 'transform',
            }}
          >
            {progress < 0.5 ? from : to}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// まとめてエクスポート
export const HardTransitions = {
  SeismicImpactSlam,
  HyperdriveSingularity,
  NeuralGlitchOverload,
  VortexShredder,
  SolarProminenceBurst,
  AbyssGravityFall,
  DimensionalRiftTear,
  CyberPuncture,
  KineticCrashBounce,
  TectonicPlateShift,
  PrismShatterBlast,
  QuantumPhaseDisruption,
  DataVoidInferno,
  MagmaticMeltdown,
  GhostEchoTrail,
};
