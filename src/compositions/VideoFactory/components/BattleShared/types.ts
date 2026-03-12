export interface BattleSpiritTheme {
  themeColor: string;
  glowColor: string;
  particleColor1: string;
  particleColor2: string;
  music: {
    src: string;
    startFrom?: number;
    volume?: number;
  };
  opponent: {
    name: string;
    image: string;
    borderColor: string;
    glowColor: string;
  };
  liver: {
    name: string;
    image: string;
    borderColor: string;
    glowColor: string;
  };
  endingText: string;
  features: {
    useGlitch: boolean;
    useMirror: boolean;
    useDoublingGrid: boolean;
  };
  lightLeakColor?: string;
}
