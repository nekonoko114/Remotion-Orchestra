import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Group, Fill, Circle, Paint, Blur, Rect } from '@shopify/react-native-skia';

// --- 1. Galaxy Swirl ---
const GalaxySwirl: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const dotsCount = 1500;
    
    // Static positions, dynamic drawing
    const dots = useMemo(() => {
        return [...Array(dotsCount)].map((_, i) => {
            const r = Math.random() * (width/2);
            const angle = Math.random() * Math.PI * 2;
            const size = Math.random() * 2.5 + 0.5;
            const speedOffset = Math.random() * 0.5 + 0.5;
            return { r, angle, size, speedOffset };
        });
    }, [width, dotsCount]);

    return (
        <Group>
            <Fill color="#020010" />
            <Group transform={[{translate: [width/2, height/2]}]}>
                {dots.map((dot, i) => {
                    // Spiral math: gravity pulling to center, rotating
                    const currentR = Math.max(10, dot.r - frame * dot.speedOffset * 2);
                    const currentAngle = dot.angle + frame * 0.05 * (300 / currentR);
                    const x = Math.cos(currentAngle) * currentR;
                    const y = Math.sin(currentAngle) * currentR;
                    const alpha = Math.min(1, currentR / 200);
                    return (
                        <Circle key={i} cx={x} cy={y} r={dot.size} color={`rgba(0, 255, 255, ${alpha})`}>{i % 20 === 0 && <Paint><Blur blur={3} /></Paint>}</Circle>
                    );
                })}
            </Group>
        </Group>
    );
};

// --- 2. Matrix Rain ---
const MatrixRain: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const columns = 50;
    const dropsPerColumn = 10;
    
    return (
        <Group>
            <Fill color="#001a00" />
            {[...Array(columns)].map((_, i) => {
                const x = (i / columns) * width;
                const speed = 10 + Math.sin(i * 45) * 5;
                const offset = i * 123;
                return (
                    <Group key={i}>
                        {[...Array(dropsPerColumn)].map((__, j) => {
                            const y = ((frame * speed + offset + j * 100) % (height + 200)) - 100;
                            const alpha = 1 - (j / dropsPerColumn);
                            return (
                                <Rect key={j} x={x} y={y} width={3} height={15} color={`rgba(0, 255, 100, ${alpha})`}>{j === 0 && <Paint><Blur blur={4} /></Paint>}</Rect>
                            );
                        })}
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 3. Confetti Explosion ---
const ConfettiExplosion: React.FC = () => {
    const frame = useCurrentFrame() % 180;
    const { width, height } = useVideoConfig();
    const confettiCount = 500;
    
    const confettis = useMemo(() => {
        return [...Array(confettiCount)].map((_, i) => {
            const angle = Math.random() * Math.PI + Math.PI; // Upwards
            const velocity = Math.random() * 20 + 10;
            const colors = ['#ff0055', '#00ffff', '#ffff00', '#00ff88', '#ffffff'];
            return {
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: colors[Math.floor(Math.random() * colors.length)],
                w: Math.random() * 8 + 4,
                h: Math.random() * 10 + 5,
                rotSpeed: (Math.random() - 0.5) * 0.2
            };
        });
    }, [confettiCount]);

    return (
        <Group>
            <Fill color="#10051a" />
            {confettis.map((c, i) => {
                const gravity = 0.5;
                const time = frame * 0.5;
                const x = width/2 + c.vx * time;
                const y = height + c.vy * time + 0.5 * gravity * time * time;
                const rotate = time * c.rotSpeed;
                if (y > height + 20) return null; // cull
                return (
                    <Group key={i} transform={[{translate: [x, y]}, {rotate}]}>
                        <Rect x={-c.w/2} y={-c.h/2} width={c.w} height={c.h} color={c.color} />
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 4. Boids Swarm ---
const BoidsSwarm: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const boidsCount = 200;
    
    return (
        <Group>
            <Fill color="#000" />
            {[...Array(boidsCount)].map((_, i) => {
                // Simulating flocking behavior using heavy math/sin/cos
                const s1 = Math.sin(frame*0.02 + i*0.1);
                const c1 = Math.cos(frame*0.015 + i*0.1);
                const groupDx = Math.sin(frame*0.01) * width/3;
                const groupDy = Math.cos(frame*0.012) * height/3;
                
                const x = width/2 + groupDx + s1 * 150 + Math.sin(i*2.3)*50;
                const y = height/2 + groupDy + c1 * 150 + Math.cos(i*1.8)*50;
                
                return (
                    <Circle key={i} cx={x} cy={y} r={3} color="#ffaa00">
                        <Paint><Blur blur={2} /></Paint>
                    </Circle>
                );
            })}
        </Group>
    );
};

// --- 5. Snow Blizzard ---
const SnowBlizzard: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const snowflakeCount = 800;
    
    const flakes = useMemo(() => {
        return [...Array(snowflakeCount)].map((_, i) => ({
            startX: Math.random() * width * 2 - width/2, // wide spawn area for wind
            speedY: Math.random() * 5 + 2,
            windFactor: Math.random() * 0.5 + 0.5,
            size: Math.random() * 3 + 1,
            wobbleSpeed: Math.random() * 0.05 + 0.02
        }));
    }, [width, snowflakeCount]);

    return (
        <Group>
            <Fill color="#001020" />
            {flakes.map((f, i) => {
                const y = (frame * f.speedY) % (height + 50) - 20;
                // Strong wind blowing right
                const x = (f.startX + frame * 15 * f.windFactor + Math.sin(frame * f.wobbleSpeed) * 50) % width;
                return (
                    <Circle key={i} cx={x} cy={y} r={f.size} color="rgba(255,255,255,0.7)">{f.size > 2.5 && <Paint><Blur blur={2} /></Paint>}</Circle>
                );
            })}
        </Group>
    );
};

export const PARTICLES_EFFECTS = [
    { name: 'GALAXY SWIRL', comp: GalaxySwirl, accent: '#00ffff' },
    { name: 'MATRIX RAIN', comp: MatrixRain, accent: '#00ff00' },
    { name: 'CONFETTI EXPLOSION', comp: ConfettiExplosion, accent: '#ff0055' },
    { name: 'BOIDS SWARM', comp: BoidsSwarm, accent: '#ffaa00' },
    { name: 'SNOW BLIZZARD', comp: SnowBlizzard, accent: '#ffffff' },
];
