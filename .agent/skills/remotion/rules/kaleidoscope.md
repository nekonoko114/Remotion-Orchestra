---
name: kaleidoscope
description: Best practices for implementing kaleidoscope backgrounds in Remotion
metadata:
  tags: kaleidoscope, background, css, skia, shaders, clip-path
---

# Kaleidoscope Backgrounds in Remotion

When implementing kaleidoscope-like backgrounds or complex repeating image patterns, follow these rules to ensure stability and compatibility.

## ALWAYS Use CSS for Kaleidoscope Effects

**Do NOT use Skia shaders (`@shopify/react-native-skia`) for kaleidoscope effects.**

Skia (CanvasKit) has initialization overhead and image loading issues in the Remotion web environment that can lead to `TypeError: Cannot read properties of undefined (reading 'MakeImageFromEncoded')` or blank frames during render.

### Recommended CSS Implementation

Use standard React/CSS with `clip-path` and `transform` to create segments.

```tsx
const KaleidoscopeBackground: React.FC<{
  imageSrc: string;
  frame: number;
  opacity?: number;
}> = ({ imageSrc, frame, opacity = 1 }) => {
  const segments = 12;
  const angle = 360 / segments;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      <div style={{
        position: 'absolute',
        inset: '-100%',
        transform: `rotate(${frame * 0.2}deg)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {new Array(segments).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '200%',
              height: '200%',
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: '30%',
              clipPath: `polygon(50% 50%, ...points)`, // Correctly calculated points
              transform: i % 2 === 1 ? 'scaleX(-1)' : 'none',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

### Why CSS?
- **Stability**: No dependencies on external WASM engines like CanvasKit.
- **Performance**: High-speed rendering using the browser's native GPU acceleration.
- **Reliability**: Images loaded via CSS `background-image` or `<Img>` preloading are more predictable during the Remotion export process.
