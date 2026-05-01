import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import {
  ZoomTransition, WhipPanTransition, SpinTransition, Push3DTransition,
  CrossBlurTransition, LightLeakTransition, GradientWipeTransition,
  IrisCircleTransition, ShapeWipeTransition, BlindsWipeTransition,
  SliceSplitTransition, GlitchTransition, PixelateTransition,
  RippleLiquidTransition, InkDropTransition
} from '../Battles/shared/Transitions15';
import {
  DoorOpenTransition, SwingPendulumTransition, CardFoldTransition,
  ZoomThroughTransition, SwirlTwirlTransition, BulgeLensTransition,
  PixelStretchTransition, MeltingTransition, ShatterGlassTransition,
  SandDisintegrateTransition, ConfettiBurstTransition, BurnThroughTransition,
  CRTTVOffTransition, PaintBrushTransition, HalftoneWipeTransition
} from '../Battles/shared/TransitionsAdvanced15';
import {
  TimeWarpScanTransition, HyperZoomFishEyeTransition, FreezeSnapTransition,
  LumaQuakeTransition, ObjectWipeTransition, WatercolorBleedTransition,
  DoubleExposureTransition, TornPaperEdgeTransition, FilmRollTransition,
  VHSRewindTransition, DataMoshingTransition, TesseractCubeTransition,
  PrismShatterTransition, CyberNeonScanTransition, RGBSplitFlashTransition
} from '../Battles/shared/TransitionsTikTok15';
import {
  TypographyMaskTransition, ComicPanelSplitTransition, CinematicBlackBarsTransition,
  SpeedRampZoomTransition, StrobeFlashTransition, GlitchSliceOffsetTransition,
  NegativeColorInvertTransition, InkSplatterTransition, CMYKColorSplitTransition,
  ScreenTearTransition, HyperspaceGridTransition, LiquidMorphTransition,
  CRTTubeCollapseTransition, VHSFastForwardTransition, ShapeBurstTransition
} from '../Battles/shared/TransitionsMV15';
import { PageTurnTransition } from './components/Transitions/PageTurnTransition';

const SCENE_A = <AbsoluteFill style={{ backgroundColor: '#0277bd', justifyContent: 'center', alignItems: 'center' }}><h1 style={{ fontSize: 400, color: '#ffdd00', textShadow: '0 0 30px black' }}>A</h1></AbsoluteFill>;
const SCENE_B = <AbsoluteFill style={{ backgroundColor: '#c62828', justifyContent: 'center', alignItems: 'center' }}><h1 style={{ fontSize: 400, color: '#ffffff', textShadow: '0 0 30px black' }}>B</h1></AbsoluteFill>;

const transitions = [
  { name: 'Zoom', comp: ZoomTransition },
  { name: 'Whip Pan', comp: WhipPanTransition },
  { name: 'Spin', comp: SpinTransition },
  { name: 'Push 3D Cube', comp: Push3DTransition },
  { name: 'Cross Blur', comp: CrossBlurTransition },
  { name: 'Light Leak', comp: LightLeakTransition },
  { name: 'Gradient Wipe', comp: GradientWipeTransition },
  { name: 'Iris Circle Wipe', comp: IrisCircleTransition },
  { name: 'Shape Wipe (Diamond)', comp: ShapeWipeTransition },
  { name: 'Blinds / Venetian', comp: BlindsWipeTransition },
  { name: 'Slice & Split', comp: SliceSplitTransition },
  { name: 'Glitch Noise', comp: GlitchTransition },
  { name: 'Block Dissolve (Pixelate)', comp: PixelateTransition },
  { name: 'Ripple / Liquid', comp: RippleLiquidTransition },
  { name: 'Ink Drop (Mask)', comp: InkDropTransition },
  { name: 'Door / Split Open', comp: DoorOpenTransition },
  { name: 'Swing / Pendulum', comp: SwingPendulumTransition },
  { name: 'Card Fold / Page Roll', comp: CardFoldTransition },
  { name: 'Zoom Through Ring', comp: ZoomThroughTransition },
  { name: 'Swirl / Twirl', comp: SwirlTwirlTransition },
  { name: 'Bulge / Lens Distortion', comp: BulgeLensTransition },
  { name: 'Pixel Stretch / Smear', comp: PixelStretchTransition },
  { name: 'Melting / Wax Drip', comp: MeltingTransition },
  { name: 'Shatter / Glass Crash', comp: ShatterGlassTransition },
  { name: 'Sand Disintegrate Wipe', comp: SandDisintegrateTransition },
  { name: 'Confetti / Star Burst', comp: ConfettiBurstTransition },
  { name: 'Film Burn Through', comp: BurnThroughTransition },
  { name: 'CRT TV Turn Off', comp: CRTTVOffTransition },
  { name: 'Paint Brush Stroke', comp: PaintBrushTransition },
  { name: 'Halftone Dots Wipe', comp: HalftoneWipeTransition },
  { name: 'Time Warp Scan', comp: TimeWarpScanTransition },
  { name: 'Hyper Zoom Fish-Eye', comp: HyperZoomFishEyeTransition },
  { name: 'Freeze Frame Snap', comp: FreezeSnapTransition },
  { name: 'Luma Quake Fade', comp: LumaQuakeTransition },
  { name: 'Object Mask Sweep', comp: ObjectWipeTransition },
  { name: 'Watercolor Bleed', comp: WatercolorBleedTransition },
  { name: 'Double Exposure Blend', comp: DoubleExposureTransition },
  { name: 'Torn Paper Edge', comp: TornPaperEdgeTransition },
  { name: 'Old Film Roll Bounce', comp: FilmRollTransition },
  { name: 'VHS Tape Rewind', comp: VHSRewindTransition },
  { name: 'Data Moshing Melt', comp: DataMoshingTransition },
  { name: '3D Tesseract Cube', comp: TesseractCubeTransition },
  { name: 'Prism Kaleido Shatter', comp: PrismShatterTransition },
  { name: 'Cyber Neon Scan', comp: CyberNeonScanTransition },
  { name: 'RGB Split Flash', comp: RGBSplitFlashTransition },
  { name: 'Typography Mask Punch', comp: TypographyMaskTransition },
  { name: 'Comic Panel Split', comp: ComicPanelSplitTransition },
  { name: 'Cinematic Black Bars', comp: CinematicBlackBarsTransition },
  { name: 'Speed Ramp Zoom Blur', comp: SpeedRampZoomTransition },
  { name: 'Strobe Flash Beat', comp: StrobeFlashTransition },
  { name: 'Glitch Slice Offset', comp: GlitchSliceOffsetTransition },
  { name: 'Negative Color Invert', comp: NegativeColorInvertTransition },
  { name: 'Ink Splatter Grunge', comp: InkSplatterTransition },
  { name: 'CMYK Color Split', comp: CMYKColorSplitTransition },
  { name: 'Screen Tear Broken', comp: ScreenTearTransition },
  { name: 'Hyperspace Grid Warp', comp: HyperspaceGridTransition },
  { name: 'Liquid Morph Deep', comp: LiquidMorphTransition },
  { name: 'CRT Tube Collapse Space', comp: CRTTubeCollapseTransition },
  { name: 'VHS Fast Forward Scroll', comp: VHSFastForwardTransition },
  { name: 'Shape Burst Circles', comp: ShapeBurstTransition },
  { name: '3D Page Turn (Book Flip)', comp: PageTurnTransition },
];

export const TRANSITION_SHOWCASE_DURATION = transitions.length * 90; // 3 seconds each

export const TransitionsCatalogShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      {transitions.map((t, index) => {
        const startFrame = index * 90;
        const TComp = t.comp;
        const relativeFrame = frame - startFrame;
        
        return (
          <Sequence key={index} from={startFrame} durationInFrames={90}>
            {/* Show A for first 30 frames, transition for 30, B for 30 */}
            {relativeFrame < 30 ? SCENE_A : 
             relativeFrame >= 60 ? SCENE_B : 
             <TComp frame={relativeFrame - 30} duration={30} SceneA={SCENE_A} SceneB={SCENE_B} />}
            
            <h2 style={{ position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center', fontSize: 60, color: 'white', background: 'rgba(0,0,0,0.8)', padding: 30, zIndex: 100, fontFamily: 'sans-serif' }}>
              {index + 1}. {t.name}
            </h2>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
