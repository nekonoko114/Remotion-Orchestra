import type React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface NumberCounterProps {
  startValue?: number;
  endValue: number;
  durationInFrames?: number;
  startFrame?: number;
  prefix?: string;
  suffix?: string;
  formatCommas?: boolean;
  style?: React.CSSProperties;
}

/**
 * 数値を滑らかにカウントアップさせるコンポーネント
 */
export const NumberCounter: React.FC<NumberCounterProps> = ({
  startValue = 0,
  endValue,
  durationInFrames = 30,
  startFrame = 0,
  prefix = '',
  suffix = '',
  formatCommas = true,
  style,
}) => {
  const frame = useCurrentFrame();

  // カウントアップの進捗計算（イージング付き）
  const currentValue = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [startValue, endValue],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad), // 最初速く、後半ゆっくり
    },
  );

  const roundedValue = Math.floor(currentValue);

  // カンマ区切りフォーマット
  const displayValue = formatCommas
    ? roundedValue.toLocaleString()
    : roundedValue.toString();

  return (
    <span
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 'bold',
        fontVariantNumeric: 'tabular-nums', // 数値の幅を固定してガタツキを防ぐ
        ...style,
      }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
