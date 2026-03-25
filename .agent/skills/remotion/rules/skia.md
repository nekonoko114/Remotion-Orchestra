# Skia (react-native-skia) を Remotion で使う正しい方法

> このルールは AI エージェントが Skia コンポーネントを実装する際に**必ず最初に読む**こと。
> 正しいパターンに従わないと、以下のランタイムエラーが必ず発生する。

## ⚠️ 必須の前提知識（なぜエラーが起きるか）

`SkiaCanvas` は内部で `useMemo` を**同期的に**実行し CanvasKit (WebAssembly) を参照する。  
しかし CanvasKit は**非同期に**ロードされるため、通常の方法でマウントすると必ず以下のエラーが発生する：

```
TypeError: Cannot read properties of undefined (reading 'Matrix')
```

**唯一の根本解決策：`React.lazy` の async 関数内で `LoadSkiaWeb` を `await` する**  
こうすることで、Skia コンポーネントのモジュールコード自体の評価・実行を  
CanvasKit の初期化完了後に遅延させることができる。

---

## バージョン互換性（この組み合わせ以外は動作しない）

| パッケージ | 使用バージョン | 備考 |
|---|---|---|
| `react` | `18.x` | **必須**。React 19 は不可 |
| `@shopify/react-native-skia` | `1.5.0` | React 18 対応の安定版 |
| `@remotion/skia` | Remotion 本体と同じ | Webpack の wasm コピーに必要 |

---

## セットアップ手順

### 1. パッケージインストール

```bash
pnpm add @remotion/skia @shopify/react-native-skia@1.5.0
```

### 2. `remotion.config.ts` に Webpack 設定を追加

```ts
import { Config } from '@remotion/cli/config';
import { enableSkia } from '@remotion/skia/enable';

Config.overrideWebpackConfig((currentConfiguration) => {
    return enableSkia(currentConfiguration);
});
```

これにより `canvaskit.wasm` がバンドルに含まれ、`/canvaskit.wasm` でアクセスできるようになる。

---

## ✅ 正しいコンポーネント構成（必ずこのパターンを使う）

### ファイル構成

```
src/compositions/VideoFactory/
├── MySkiaShowcase.tsx      ← Suspense ラッパー（外側）
└── MySkiaInner.tsx         ← 実際の Skia コード（内側）
```

### MySkiaShowcase.tsx（ラッパー）

```tsx
import React, { Suspense } from 'react';
import { AbsoluteFill } from 'remotion';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web/LoadSkiaWeb';

// !! KEY POINT !!
// React.lazy の async 関数内で LoadSkiaWeb を await してから動的インポートする
// これにより MySkiaInner のモジュールコードが CanvasKit 初期化後にのみ評価される
const SkiaInner = React.lazy(async () => {
    await LoadSkiaWeb({ locateFile: (file: string) => `/${file}` });
    return import('./MySkiaInner');
});

export const MySkiaShowcase: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <Suspense
                fallback={
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ color: '#fff', fontSize: 24 }}>Loading Skia...</div>
                    </AbsoluteFill>
                }
            >
                <SkiaInner />
            </Suspense>
        </AbsoluteFill>
    );
};
```

### MySkiaInner.tsx（実際の Skia コード）

```tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SkiaCanvas } from '@remotion/skia';
import { Group, Circle, Blur, Fill, Path, Skia } from '@shopify/react-native-skia';

// このファイルは CanvasKit の初期化後にのみ評価されるため安全
export const MySkiaInner: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    return (
        <SkiaCanvas style={{ flex: 1 }} width={width} height={height}>
            <Group>
                <Fill color="#000" />
                <Circle cx={width / 2} cy={height / 2} r={100 + frame} color="#ff0088">
                    <Blur blur={20} />
                </Circle>
            </Group>
        </SkiaCanvas>
    );
};

export default MySkiaInner;
```

---

## ❌ やってはいけないパターン

### NG1: `SkiaCanvas` を直接使う（初期化タイミングが保証されない）

```tsx
// ❌ これは Matrix エラーが発生する
export const BadComponent: React.FC = () => {
    return (
        <SkiaCanvas width={1920} height={1080}>
            <Group>...</Group>
        </SkiaCanvas>
    );
};
```

### NG2: `index.ts` で `LoadSkiaWeb` を呼んでも解決しない

```tsx
// ❌ Remotion が非同期完了を待たずにコンポーネントをプリレンダリングするため無効
LoadSkiaWeb().then(() => registerRoot(RemotionRoot));
```

### NG3: `Skia` オブジェクトの存在チェックでガードしても無効

```tsx
// ❌ Canvas.js の useMemo は Suspense を抜けないため無効
if (!Skia || !Skia.Matrix) return null;
```

---

## 利用可能な Skia コンポーネント

`@shopify/react-native-skia` からインポートする：

```tsx
import {
    Group, Fill,
    Circle, Rect, Path, Line,
    Paint, Blur, ColorMatrix,
    SweepGradient, LinearGradient, RadialGradient,
    Skia, vec, interpolateColors,
    Image, useImage,
} from '@shopify/react-native-skia';
```

`@remotion/skia` からインポートする：

```tsx
import { SkiaCanvas } from '@remotion/skia';
```

---

## 参考実装ファイル

- [SkiaEffectsShowcase.tsx](../../src/compositions/VideoFactory/SkiaEffectsShowcase.tsx) — ラッパーの実例
- [SkiaEffectsInner.tsx](../../src/compositions/VideoFactory/SkiaEffectsInner.tsx) — Skia エフェクトの実例（Neon Pulse, Liquid Morph 等）
