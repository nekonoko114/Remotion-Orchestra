import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont } from "@remotion/google-fonts/Nosifer";
import { loadFont as loadFont2 } from "@remotion/google-fonts/Bangers";

const { fontFamily: font1 } = loadFont();
const { fontFamily: font2 } = loadFont2();

export const TypographyShowcase: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
             <div style={{
                position: 'absolute',
                top: 50,
                width: '100%',
                textAlign: 'center',
                color: '#aaa',
                fontFamily: 'sans-serif',
                fontSize: 30,
            }}>
                Typography Skill: @remotion/google-fonts
            </div>

            <h1 style={{ fontFamily: font1, fontSize: 100, color: '#ff4444', textShadow: '0 0 10px red' }}>
                SCARY FONT
            </h1>
            <h1 style={{ fontFamily: font2, fontSize: 100, color: '#4444ff', textShadow: '5px 5px 0px #000' }}>
                COMIC FONT
            </h1>
            <p style={{ color: 'white', fontFamily: 'sans-serif', opacity: 0.7 }}>
                Zero-config font loading
            </p>
        </AbsoluteFill>
    );
};
