import React, { useEffect, useRef, useMemo } from 'react';
import {
  useCurrentFrame,
  AbsoluteFill,
  Sequence,
  interpolate,
  useVideoConfig,
  Easing,
} from 'remotion';
import { gsap } from 'gsap';
import { LYRICS } from './lyrics';

// --- 4. Handwritten Style (Intro/A-Melo Variation) ---
// ペンで書いているような「削り出し」出現。ゆらゆら揺れる。
const HandwrittenLyric: React.FC<{ text: string; duration: number }> = ({
  text,
  duration,
}) => {
  const frame = useCurrentFrame();

  // Google Fonts: Klee One (きれいな硬筆体)
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '100%',
        height: '100%',
        padding: '0 100px 150px 100px',
      }}
    >
      {text.split('').map((char, i) => {
        // 文字ごとの開始タイミングをずらす
        const charStart = i * 5;
        const charDuration = 12; // 一文字を書くのにかかる時間

        // 書き進めるアニメーション (左から右へ clip-path を開く)
        const clipProgress = interpolate(
          frame,
          [charStart, charStart + charDuration],
          [100, 0],
          {
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        );

        const opacity = interpolate(frame, [charStart, charStart + 2], [0, 1], {
          extrapolateRight: 'clamp',
        });

        // 微小な揺れ（手書き感）
        const jitterX = Math.sin(frame * 0.2 + i) * 1.5;
        const jitterY = Math.cos(frame * 0.15 + i) * 1.5;
        const rotate = Math.sin(i * 1.5) * 2;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: '"Klee One", cursive',
              fontSize: '85px',
              fontWeight: 600,
              color: '#f8f9fa',
              WebkitTextStroke: '3px #000',
              paintOrder: 'stroke fill',
              opacity,
              clipPath: `inset(0 ${clipProgress}% 0 0)`,
              transform: `translate(${jitterX}px, ${jitterY}px) rotate(${rotate}deg)`,
              margin: '0 4px',
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
              whiteSpace: 'pre',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

// --- 3. Seishun Playful Style (Chorus) ---
// 真のHoneyWorks/ボカロMVスタイル：ホワイトアウトラインからの色彩変化 ＆ シーケンシャル・スライド
// 「白」で登場し、「青」に染まり、「左」へ流れる。視線誘導を意識した高度な演出。
const SeishunPlayfulLyric: React.FC<{ text: string; duration: number }> = ({
  text,
  duration,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // フォントの動的読み込み ("M PLUS Rounded 1c" ExtraBold)
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {};
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // 重要な設定：文字ごとのアニメーション間隔 (Dynamic Stagger)
      // 歌の尺に合わせて、文字が出るスピードを自動調整する
      const durationInSeconds = duration / fps;
      // 歌い終わる少し前(80%)には出し切りたいので * 0.8
      // 早すぎたり遅すぎたりしないよう、0.03秒〜0.2秒の範囲に制限
      const baseStagger = (durationInSeconds * 0.8) / text.length;
      const STAGGER_TIME = Math.min(0.2, Math.max(0.04, baseStagger));

      const vibrantColors = [
        '#FF4757',
        '#2ED573',
        '#FFA502',
        '#1E90FF',
        '#3742fa',
      ];

      // 1. 登場（Appear）：わんぱくバウンス
      tl.fromTo(
        '.playful-char',
        {
          scale: 0,
          opacity: 0,
          y: 100,
          rotation: () => (Math.random() - 0.5) * 90,
          color: 'white',
          webkitTextStrokeColor: 'white',
        },
        {
          duration: 0.6,
          scale: () => 0.9 + Math.random() * 0.3,
          opacity: 1,
          y: 0,
          rotation: () => (Math.random() - 0.5) * 10,
          ease: 'elastic.out(1.2, 0.4)',
          stagger: STAGGER_TIME,
        },
      );

      // 2. 疾走＆色彩変化（Run & Color）：登場と並行してスタート！

      // A. 色彩変化 (Pop!)
      // ポップな「シール風」スタイルへ変身：白文字 -> カラフル中身 + 白ふち
      tl.to(
        '.playful-char',
        {
          color: (i) => vibrantColors[i % vibrantColors.length], // 中身をカラフルに
          webkitTextStrokeColor: 'white', // ふちは白く！
          scale: '+=0.1',
          duration: 0.2,
          ease: 'power2.out',
          stagger: STAGGER_TIME,
        },
        '<0.1',
      ); // 登場から0.1秒後に色が弾ける

      // B. 疾走 (Shift Left & Skew & Stretch)
      // ユーザー要望：上下にもっと伸ばして「ぷるん」とさせる
      // 疾走フェーズ：横に超伸ばして、縦に超潰す（反動を作るため）
      tl.to(
        '.playful-char',
        {
          scaleX: 2.2, // ビヨーン（横）
          scaleY: 0.4, // ペチャンコ（縦）
          skewX: -40, // 前のめり
          x: -50, // 少し左へ
          color: (i: number) => vibrantColors[i % vibrantColors.length],
          duration: 0.15,
          stagger: STAGGER_TIME,
        },
        '<0.05',
      );

      // Recover (ぷるん！フェーズ)
      // 潰れた状態から一気に戻ることで、縦に伸びる反動が生まれる
      tl.to(
        '.playful-char',
        {
          scaleX: 1,
          scaleY: 1,
          skewX: 0,
          x: 0,
          // ここでハードシャドウ適用
          filter: 'drop-shadow(20px 20px 0px #091e59)',
          WebkitTextStrokeColor: '#ffffff',
          duration: 0.8,
          ease: 'elastic.out(2, 0.3)', // 振幅大きく、減衰は普通
          stagger: STAGGER_TIME,
        },
        '<0.12',
      );

      // 4. 余韻：わちゃわちゃループ
      tl.to(
        '.playful-char',
        {
          y: (i) => (i % 2 === 0 ? -8 : 8),
          rotation: (i) => (i % 2 === 0 ? 3 : -3),
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: {
            each: 0.1,
            from: 'random',
          },
        },
        '-=0.2',
      );

      // 5. 退場（Exit）：シュッと消える
      const exitStartTime = duration / fps - 0.4;
      tl.to(
        '.playful-char',
        {
          duration: 0.3,
          scale: 0,
          opacity: 0,
          y: -50,
          rotation: 45,
          ease: 'back.in(1.7)',
          stagger: 0.05,
        },
        exitStartTime,
      );

      timeline.current = tl;
    }, containerRef);
    return () => ctx.revert();
  }, [text, duration, fps]);

  useEffect(() => {
    if (timeline.current) {
      timeline.current.seek(frame / fps);
    }
  }, [frame, fps]);

  // 「上下に避けて配置（顔を隠さない）」＆「長文グリッド」配置
  const charPositions = useMemo(() => {
    const fontSize = 100;
    // ユーザー要望：もっと横幅を広げる（文字間隔を空ける）
    const spacing = fontSize * 2; // 0.65 -> 0.95 (重なりをなくし、堂々と配置)
    const lineHeight = fontSize * 1.0; // 縦の間隔も少し広げる
    const MAX_CHARS_PER_ROW = 7; // 1行あたり5文字

    // 行数計算
    const numRows = Math.ceil(text.length / MAX_CHARS_PER_ROW);

    // 上下分割のロジック
    // 1行だけなら「下」に固定（字幕っぽく）
    // 2行以上なら「上」と「下」に振り分ける
    const splitRowIndex = numRows > 1 ? Math.floor(numRows / 2) : -1;

    // 上ゾーンと下ゾーンの基準Y位置（中心からどれくらい離すか）
    // 画面下部に配置
    const TOP_ZONE_Y = 280;
    const BOTTOM_ZONE_Y = 400;

    return text.split('').map((_, i) => {
      const row = Math.floor(i / MAX_CHARS_PER_ROW);
      const col = i % MAX_CHARS_PER_ROW; // 列インデックス（0, 1, 2...）

      // その行の文字数を計算して、行ごとに中央揃えする
      const charsInThisRow = Math.min(
        MAX_CHARS_PER_ROW,
        text.length - row * MAX_CHARS_PER_ROW,
      );
      const rowWidth = charsInThisRow * spacing;
      const startXForRow = -(rowWidth / 2) + spacing / 2; // この行の左端

      // ゾーン振り分け
      let zoneBaseY = 0;
      if (numRows === 1) {
        zoneBaseY = BOTTOM_ZONE_Y; // 1行なら下
      } else {
        zoneBaseY = row < splitRowIndex ? TOP_ZONE_Y : BOTTOM_ZONE_Y;
      }

      // 基本位置
      const baseX = startXForRow + col * spacing;
      const baseY = zoneBaseY + (row % (splitRowIndex || 1)) * lineHeight; // ゾーン内での行送り

      // ランダムな「暴れ」を抑える
      const jitterX = (Math.random() - 0.5) * 30;
      const jitterY = (Math.random() - 0.5) * 40;
      const rotation = (Math.random() - 0.5) * 15;

      return { x: baseX + jitterX, y: baseY + jitterY, rotation };
    });
  }, [text]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
      }}
    >
      {/* 散乱配置なので Flexbox ではなく絶対配置の親とする */}
      {text.split('').map((char, i) => (
        <div
          key={i}
          className="playful-char"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: `${charPositions[i].x}px`,
            marginTop: `${charPositions[i].y}px`,
            transform: `rotate(${charPositions[i].rotation}deg)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // アニメーション用の初期スタイル
            transformOrigin: 'center bottom',
            // 文字色はGSAPで親に適用される -> 子のmainが継承
            color: '#ffffff',
          }}
        >
          {/* 1. ハードストライプシャドウ (Shadow Layer) - 控えめに */}
          <span
            style={{
              position: 'absolute',
              left: '10px',
              top: '10px',
              fontFamily: '"M PLUS Rounded 1c", sans-serif',
              fontSize: '110px',
              fontWeight: 900,
              whiteSpace: 'pre',
              lineHeight: 0.8,
              zIndex: -1,
              color: 'transparent',
              backgroundImage:
                'repeating-linear-gradient(90deg, #091e59 0px, #091e59 4px, transparent 4px, transparent 8px)',
              WebkitBackgroundClip: 'text',
              WebkitTextStroke: '12px #091e59',
              opacity: 0.4,
            }}
          >
            {char}
          </span>

          {/* 2. 本体 (Main Layer) - 小さめに */}
          <span
            className="front-char"
            style={{
              position: 'relative',
              zIndex: 1,
              fontFamily: '"M PLUS Rounded 1c", sans-serif',
              fontSize: '110px',
              fontWeight: 900,
              whiteSpace: 'pre',
              lineHeight: 0.8,
              color: 'currentColor',
              WebkitTextStroke: '10px white',
              paintOrder: 'stroke fill',
            }}
          >
            {char}
          </span>
        </div>
      ))}
    </div>
  );
};

// --- 6. Blur Dissolve (Soft Transition) ---
// 霧の中から現れ、霧の中に消える
const BlurDissolveLyric: React.FC<{ text: string; duration: number }> = ({
  text,
  duration,
}) => {
  const frame = useCurrentFrame();

  const blur = interpolate(
    frame,
    [0, 20, duration - 20, duration],
    [20, 0, 0, 20],
  );
  const scale = interpolate(
    frame,
    [0, 20, duration - 20, duration],
    [1.2, 1, 1, 0.8],
  );
  const opacity = interpolate(
    frame,
    [0, 20, duration - 20, duration],
    [0, 1, 1, 0],
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '100%',
        height: '100%',
        filter: `blur(${blur}px)`,
        transform: `scale(${scale})`,
        opacity,
        paddingBottom: '150px',
      }}
    >
      <span
        style={{
          fontFamily: '"Klee One", cursive',
          fontSize: '95px',
          fontWeight: 600,
          color: '#fff',
          WebkitTextStroke: '6px #000',
          paintOrder: 'stroke fill',
          letterSpacing: '10px',
          filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))',
        }}
      >
        {text}
      </span>
    </div>
  );
};

// --- 11. Sketch Reveal Style (Premium Handwritten) ---
// 下書きのアウトラインが浮き出てから、中身がペンで書かれる
const SketchRevealLyric: React.FC<{ text: string; duration: number }> = ({
  text,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '100%',
        height: '100%',
        paddingBottom: '150px',
      }}
    >
      {text.split('').map((char, i) => {
        const charStart = i * 6;
        const progress = Math.max(0, frame - charStart);

        // 1. アウトラインの浮き出し (0〜15f)
        const outlineBlur = interpolate(progress, [0, 10], [10, 0], {
          extrapolateRight: 'clamp',
        });
        const outlineOpacity = interpolate(progress, [0, 10, 20], [0, 0.8, 1], {
          extrapolateRight: 'clamp',
        });

        // 2. 中身の書き込み (5〜20f)
        const fillProgress = interpolate(progress, [5, 20], [100, 0], {
          easing: Easing.bezier(0.42, 0, 0.58, 1),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // 微小な震え
        const jitterX = Math.sin(frame * 0.3 + i) * 1;
        const jitterY = Math.cos(frame * 0.25 + i) * 1;

        return (
          <div
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              margin: '0 4px',
              transform: `translate(${jitterX}px, ${jitterY}px)`,
            }}
          >
            {/* Layer 1: The Emerging Outline */}
            <span
              style={{
                fontFamily: '"Klee One", cursive',
                fontSize: '85px',
                fontWeight: 600,
                color: 'transparent',
                WebkitTextStroke: '4px #000',
                paintOrder: 'stroke fill',
                opacity: outlineOpacity,
                filter: `blur(${outlineBlur}px)`,
              }}
            >
              {char}
            </span>

            {/* Layer 2: The Writing Fill */}
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                fontFamily: '"Klee One", cursive',
                fontSize: '85px',
                fontWeight: 600,
                color: 'white',
                clipPath: `inset(0 ${fillProgress}% 0 0)`,
                zIndex: 1,
              }}
            >
              {char}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const SubtitleOverlay: React.FC = () => {
  return (
    <AbsoluteFill style={{ zIndex: 100 }}>
      {LYRICS.map((lyric, index) => {
        const duration = lyric.endFrame - lyric.startFrame;
        if (duration <= 0) return null;

        // 超派手なスタイルを優先的に混ぜる
        let Component = HandwrittenLyric;

        // スタイルを3種類に集約（Sketch, Blur, Handwritten）
        const styleCycle = index % 3;

        if (styleCycle === 0) Component = SketchRevealLyric;
        if (styleCycle === 1) Component = BlurDissolveLyric;
        if (styleCycle === 2) Component = HandwrittenLyric;

        // 特殊タグがある場合も、雰囲気を壊さないスタイルに
        if (lyric.style === 'pop') {
          // サビは「融合」スタイル：SeishunPlayfulLyric を控えめにして復活
          Component = SeishunPlayfulLyric;
        } else if (lyric.style === 'cinematic') {
          Component = BlurDissolveLyric;
        }

        return (
          <Sequence
            key={index}
            from={lyric.startFrame}
            durationInFrames={duration}
            name={`Lyric: ${lyric.text}`}
          >
            <Component text={lyric.text} duration={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
