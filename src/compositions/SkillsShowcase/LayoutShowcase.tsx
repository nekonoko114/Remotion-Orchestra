import React from 'react';
import { AbsoluteFill } from 'remotion';
import '../../index.css'; // Ensure Tailwind is applied

export const LayoutShowcase: React.FC = () => {
    return (
        <AbsoluteFill className="bg-slate-900 text-white flex flex-col items-center justify-center gap-8">
            <div className="absolute top-12 w-full text-center text-4xl font-sans font-bold">
                Layout Skill: Tailwind CSS for Remotion
            </div>
            
            <div className="grid grid-cols-2 gap-8 w-2/3">
                <div className="bg-blue-500 p-8 rounded-xl shadow-lg border-2 border-blue-400 flex items-center justify-center transform hover:scale-105 transition-transform">
                    <h2 className="text-3xl font-bold">Grid Layout</h2>
                </div>
                <div className="bg-purple-600 p-8 rounded-xl shadow-lg border-2 border-purple-400 flex items-center justify-center">
                    <h2 className="text-3xl font-bold">Flexbox</h2>
                </div>
                <div className="bg-pink-500 p-8 rounded-xl shadow-lg border-2 border-pink-400 col-span-2 flex items-center justify-center">
                    <h2 className="text-3xl font-bold">Responsive Design</h2>
                </div>
            </div>

            <div className="mt-8 p-4 bg-white/10 backdrop-blur-md rounded-lg">
                <code className="text-xl font-mono text-cyan-300">className="grid grid-cols-2 gap-8"</code>
            </div>
        </AbsoluteFill>
    );
};
