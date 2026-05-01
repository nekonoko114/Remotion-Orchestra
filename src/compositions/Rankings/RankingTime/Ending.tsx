import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const scaleFactor = width / 1080;

  return (
    <AbsoluteFill>
      {/* Logo placed small in bottom right */}
      <div
        style={{
          position: 'absolute',
          right: 60 * scaleFactor,
          bottom: 60 * scaleFactor,
          width: 300 * scaleFactor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: `drop-shadow(0px ${5 * scaleFactor}px ${15 * scaleFactor}px rgba(0, 0, 0, 0.8))`,
          zIndex: 9001,
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <Img
          src={staticFile('jol-logo-800.png')}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
