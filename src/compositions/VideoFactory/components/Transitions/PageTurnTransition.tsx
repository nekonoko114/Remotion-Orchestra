import React from 'react';
import { AbsoluteFill, interpolate, Easing } from 'remotion';

export const PageTurnTransition: React.FC<{
  frame: number;
  duration: number;
  SceneA: React.ReactNode;
  SceneB: React.ReactNode;
  direction?: 'left-to-right' | 'right-to-left';
}> = ({ frame, duration, SceneA, SceneB, direction = 'right-to-left' }) => {
  // progress from 0 to 1
  const progress = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  
  const isRTL = direction === 'right-to-left';

  // 3-Phase Animation:
  // Phase 1 (0 to 0.25): Zoom out from right page to show full book
  // Phase 2 (0.25 to 0.75): Turn the page
  // Phase 3 (0.75 to 1.0): Zoom back into the new right page

  // Calculate Zoom (Scale)
  // Starts at 1.0 (looking at 1 page). Zooms out to 0.45 to fit the 2160x1920 book in 1080x1920.
  const scale = interpolate(progress, 
    [0, 0.25, 0.75, 1], 
    [1, 0.45, 0.45, 1], 
    { easing: Easing.inOut(Easing.quad) }
  );

  // Calculate Camera X Shift (Focus)
  // At scale=1, seeing right page: translateX = -1080
  // At scale=0.45, centering book (W=972) in screen (W=1080): translateX = (1080 - 972) / 2 = 54
  const translateX = interpolate(progress,
    [0, 0.25, 0.75, 1],
    [-1080, 54, 54, -1080],
    { easing: Easing.inOut(Easing.quad) }
  );

  // Translate Y to center it vertically at scale 0.45 (1920 * 0.45 = 864. Margin = (1920 - 864)/2 = 528)
  const translateY = interpolate(progress,
    [0, 0.25, 0.75, 1],
    [0, 528, 528, 0],
    { easing: Easing.inOut(Easing.quad) }
  );

  // Page Turn Rotation
  // Starts turning at 0.25, finishes at 0.75
  const turnProgress = interpolate(progress, [0.25, 0.75], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const rotateY = interpolate(turnProgress, [0, 1], [0, isRTL ? -180 : 180], { easing: Easing.inOut(Easing.cubic) });

  // Book Page Dimensions
  const PAGE_W = 1080;
  const PAGE_H = 1920;
  const BOOK_W = PAGE_W * 2; // 2160

  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}> 
      {/* Background radial gradient to give it a spotlight on desk feel */}
      <AbsoluteFill style={{ background: 'radial-gradient(circle at center, rgba(50,30,20,0.8) 0%, rgba(0,0,0,1) 100%)' }} />

      {/* The 3D Book Camera / Container */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: BOOK_W,
        height: PAGE_H,
        transformOrigin: '0 0',
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        perspective: 4000,
        transformStyle: 'preserve-3d',
      }}>
        
        {/* Book Cover (Leather Backing) */}
        <div style={{
          position: 'absolute',
          left: -40, right: -40, top: -40, bottom: -40,
          backgroundColor: '#2c1e16', // Dark leather brown
          borderRadius: 40,
          boxShadow: '0 50px 100px rgba(0,0,0,0.8), inset 0 0 50px rgba(0,0,0,0.8)',
        }}>
          {/* Spine Binding Crease */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 60, marginLeft: -30, backgroundColor: 'rgba(0,0,0,0.3)', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)' }} />
        </div>

        {/* Left Page (Base) */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, width: PAGE_W, height: PAGE_H,
          backgroundColor: '#f5f5f5',
          borderRadius: '15px 0 0 15px',
          boxShadow: 'inset -30px 0 80px rgba(0,0,0,0.15)', // Crease shadow
          overflow: 'hidden'
        }}>
          {/* Left page is left blank/white as requested */}
        </div>

        {/* Right Page (Base) -> Scene B */}
        <div style={{
          position: 'absolute',
          left: PAGE_W, top: 0, width: PAGE_W, height: PAGE_H,
          backgroundColor: '#ffffff',
          borderRadius: '0 15px 15px 0',
          boxShadow: 'inset 30px 0 80px rgba(0,0,0,0.15)', // Crease shadow
          overflow: 'hidden'
        }}>
          {SceneB}
        </div>

        {/* Turning Page (Starts on Right as Scene A, ends on Left as White) */}
        <div style={{
          position: 'absolute',
          left: PAGE_W, top: 0, width: PAGE_W, height: PAGE_H,
          transformOrigin: 'left center', // Spine is on the left of this right-aligned page
          transform: `rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}>
          
          {/* Front Face = Scene A */}
          <AbsoluteFill style={{ 
            backfaceVisibility: 'hidden', 
            borderRadius: '0 15px 15px 0',
            overflow: 'hidden',
          }}>
            {SceneA}
            
            {/* Shadow moving across SceneA as it lifts */}
            <AbsoluteFill style={{ 
              background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent 30%)',
              opacity: turnProgress < 0.5 ? interpolate(turnProgress, [0, 0.5], [0, 0.8]) : 0,
              pointerEvents: 'none',
            }} />
          </AbsoluteFill>

          {/* Back Face = White Page */}
          <AbsoluteFill style={{
            backfaceVisibility: 'hidden',
            backgroundColor: '#f0f0f0',
            transform: 'rotateY(180deg)',
            borderRadius: '15px 0 0 15px', // Matches left page shape when flipped
            // The crease shadow on the back face is on its visual right side
            boxShadow: 'inset -40px 0 80px rgba(0,0,0,0.15)',
          }}>
            {/* Crease shadow moving across Back face as it lands */}
            <AbsoluteFill style={{ 
              background: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent 30%)',
              opacity: turnProgress > 0.5 ? interpolate(turnProgress, [0.5, 1], [0.8, 0]) : 0,
              pointerEvents: 'none',
            }} />
          </AbsoluteFill>
          
        </div>

      </div>
    </AbsoluteFill>
  );
};
