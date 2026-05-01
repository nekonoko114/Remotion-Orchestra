import { loadFont as loadOrbitron } from '@remotion/google-fonts/Orbitron';
import { loadFont as loadDelaGothic } from '@remotion/google-fonts/DelaGothicOne';

// フォントのロード
const { fontFamily: orbitronFamily } = loadOrbitron();
const { fontFamily: delaGothicFamily } = loadDelaGothic();

export const UNITY_THEME = {
  colors: {
    // ハイパースペース・サイバーカラー
    neonRed: '#ff1e1e',
    neonBlue: '#00ffff',
    textWhite: '#ffffff',
    panelBg: 'rgba(0, 20, 40, 0.8)',
    shadowRed: 'rgba(255, 30, 30, 0.6)',
    shadowBlue: 'rgba(0, 255, 255, 0.6)',
  },
  
  fonts: {
    // ローカルフォントを優先しつつ Google Fonts も読み込む設定
    main: `${orbitronFamily}, "Orbitron", sans-serif`,
    japanese: `${delaGothicFamily}, "Dela Gothic One", sans-serif`,
    status: 'monospace',
    suffix: 'serif',
  },

  animations: {
    staggerFactor: 20,
    transitionFrames: 30,
  }
};
