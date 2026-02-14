import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SkiaCanvas } from '@remotion/skia';
import { Fill, Shader, Skia } from '@shopify/react-native-skia';
import { TunnelVariant } from './Tunnel3D';

// Shader Library
const SHADERS = {
    cyberpunk: Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;
        
        float f(float3 p) {
            p.z -= u_time * 10.;
            float a = p.z * .1;
            p.xy *= mat2(cos(a), sin(a), -sin(a), cos(a));
            return .1 - length(cos(p.xy) + sin(p.yz));
        }
        
        half4 main(float2 fragCoord) { 
            float3 d = .5 - float3(fragCoord, 1.) / u_resolution.x;
            float3 p=float3(0.);
            for (int i = 0; i < 32; i++) {
                p += f(p) * d;
            }
            // Cyan/Magenta/Purple
            float3 col = sin(p * 3. + float3(0, 1, 2) + u_beat * 5.) * 0.5 + 0.5;
            return half4(col * 0.4, 1.0);
        }
    `)!,

    wireframe: Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;

        half4 main(float2 fragCoord) {
            float2 uv = fragCoord.xy / u_resolution.xy;
            float grid = step(0.95, fract(uv.x * 20.0)) + step(0.95, fract(uv.y * 20.0));
            // Green matrix feel
            return half4(0.0, grid * 0.5, 0.0, 1.0);
        }
    `)!,

    fire: Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;

        // Simple noise
        float hash(float n) { return fract(sin(n)*43758.5453); }
        float noise(float3 x) {
            float3 p = floor(x);
            float3 f = fract(x);
            f = f*f*(3.0-2.0*f);
            float n = p.x + p.y*57.0 + 113.0*p.z;
            return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
        }

        half4 main(float2 fragCoord) {
            float2 uv = fragCoord.xy / u_resolution.xy;
            float3 p = float3(uv * 5.0, u_time * 2.0);
            float f = noise(p);
            
            // Fire palette: Red -> Orange -> Yellow
            float3 col = mix(float3(1.0, 0.0, 0.0), float3(1.0, 1.0, 0.0), f);
            
            // Pulse with beat
            col *= (1.0 + u_beat * 0.5);
            return half4(col * 0.5, 1.0);
        }
    `)!,
    
    warp: Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;

        half4 main(float2 fragCoord) {
           // Starfield / Warp effect
           float2 uv = (fragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;
           float s = 0.0;
           for(int i=0; i<10; i++) {
               float t = u_time * 2.0 + float(i);
               float z = fract(t);
               float2 p = uv * (10.0 / z);
               float d = length(p);
               // Simple white dots
               if (d < 0.1) s += 1.0 - smoothstep(0.0, 0.1, d);
           }
           return half4(s * 0.5, s * 0.5, s * 0.8, 1.0);
        }
    `)!,

    ethereal: Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;

        half4 main(float2 fragCoord) {
            float2 uv = fragCoord.xy / u_resolution.xy;
            float3 col = float3(0.8, 0.8, 0.9); // Pale blue/white
            
            // Soft shifting
            float f = sin(uv.x * 10.0 + u_time) * sin(uv.y * 10.0 - u_time);
            col += f * 0.1;
            
            return half4(col * 0.3, 1.0);
        }
    `)!,

     lightning: Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;

        half4 main(float2 fragCoord) {
            float2 uv = fragCoord.xy / u_resolution.xy;
            // Dark stormy blue background
            float3 col = float3(0.0, 0.0, 0.1);
            
            // Random flash
            float flash = step(0.98, fract(sin(u_time * 50.0) * 43758.5453)) * u_beat;
            col += float3(1.0) * flash;

            return half4(col, 1.0);
        }
    `)!,

    'split-fire': Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;

        // Simple noise
        float hash(float n) { return fract(sin(n)*43758.5453); }
        float noise(float3 x) {
            float3 p = floor(x);
            float3 f = fract(x);
            f = f*f*(3.0-2.0*f);
            float n = p.x + p.y*57.0 + 113.0*p.z;
            return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
        }

        half4 main(float2 fragCoord) {
            float2 uv = fragCoord.xy / u_resolution.xy;
            float3 p = float3(uv * 5.0, u_time * 2.0);
            float f = noise(p);
            
            float3 col;
            
            // Split screen logic
            if (uv.x < 0.5) {
                // Left: Red Fire
                col = mix(float3(1.0, 0.0, 0.0), float3(1.0, 1.0, 0.0), f);
            } else {
                // Right: Green Fire
                col = mix(float3(0.0, 0.5, 0.0), float3(0.5, 1.0, 0.5), f);
            }
            
            // Pulse with beat
            col *= (1.0 + u_beat * 0.5);
            return half4(col * 0.5, 1.0);
        }
    `)!,

    gold: Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;
        
        half4 main(float2 fragCoord) {
            float2 uv = fragCoord / u_resolution;
            
            // Golden waves
            float wave1 = sin(uv.x * 10.0 + u_time * 2.0);
            float wave2 = cos(uv.y * 10.0 + u_time * 3.0);
            float waves = (wave1 + wave2) * 0.5 + 0.5;
            
            float3 goldColor = float3(1.0, 0.84, 0.0);
            float3 darkGold = float3(0.5, 0.3, 0.0);
            
            float3 col = mix(darkGold, goldColor, waves);
            
            // Sparkles
            float sparkle = step(0.98, fract(sin(dot(uv + u_time * 0.1, float2(12.9898, 78.233))) * 43758.5453));
            col += sparkle * (1.0 + u_beat);
            
            // Beat flash
            col += goldColor * u_beat * 0.2;
            
            return half4(col, 1.0);
        }
    `)!,

    kaleido: Skia.RuntimeEffect.Make(`
        uniform float2 u_resolution;
        uniform float u_time;
        uniform float u_beat;
        
        float3 hsv2rgb(float3 c) {
            float4 K = float4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            float3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        half4 main(float2 fragCoord) {
            float2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;
            
            // Kaleidoscope
            float a = atan(uv.y, uv.x);
            float r = length(uv);
            
            // Rotate
            a += u_time * 0.5;
            
            // Mirror
            a = abs(mod(a, 3.14159/3.0) - 3.14159/6.0);
            
            // Pattern
            float val = sin(a * 10.0 + r * 20.0 - u_time * 5.0);
            
            // Color shift logic
            float hue = fract(u_time * 0.1 + r * 0.5);
            float3 col = hsv2rgb(float3(hue, 1.0, 1.0));
            
            col *= smoothstep(0.2, 0.8, val + 0.5);
            col *= (1.0 + u_beat * 0.5);
            
            return half4(col, 1.0);
        }
    `)!,
};


export const AudioReactiveBackgroundImpl: React.FC<{ beat: number; variant?: TunnelVariant }> = ({ beat, variant = 'cyberpunk' }) => {
    const { width, height, fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const time = frame / fps;

    const source = SHADERS[variant] || SHADERS['cyberpunk'];

    const uniforms = useMemo(() => {
        return {
            u_resolution: [width, height],
            u_time: time,
            u_beat: beat,
        };
    }, [width, height, time, beat, variant]);

    return (
        <SkiaCanvas width={width} height={height}>
            <Fill>
                <Shader source={source} uniforms={uniforms} />
            </Fill>
        </SkiaCanvas>
    );
};
