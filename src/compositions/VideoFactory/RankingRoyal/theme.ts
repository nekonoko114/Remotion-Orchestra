import { loadFont as loadCinzel } from '@remotion/google-fonts/CinzelDecorative';
import { loadFont as loadMincho } from '@remotion/google-fonts/BIZUDMincho';

const { fontFamily: cinzelFamily } = loadCinzel('normal', {
  ignoreTooManyRequestsWarning: true,
});
const { fontFamily: minchoFamily } = loadMincho('normal', {
  ignoreTooManyRequestsWarning: true,
});

export const ROYAL_THEME = {
  colors: {
    // 深い夜空の色 (ベース背景色など)
    midnightBlue: '#000814',
    // やや明るいネイビー (パネル背景など)
    royalNavy: '#001D3D',
    // 濃厚なネイビー (影など)
    deepNavy: '#001026',
    
    // シャンパンゴールド系 (テキスト・ボーダー)
    champagneGoldLight: '#FFF8E7', // ハイライト
    champagneGold: '#F7E7CE',      // ベース
    champagneGoldDark: '#B89B66',  // シャドウ・エッジ
    
    // 発光・シャドウ
    goldGlow: 'rgba(247, 231, 206, 0.4)',
    cyanGlow: 'rgba(0, 168, 255, 0.3)', // さりげない宝石の輝き
    
    textWhite: '#FFFFFF',
  },
  
  // ゴールドグラデーション (本物の金属のような質感)
  gradients: {
    goldLinear: 'linear-gradient(135deg, #F7E7CE 0%, #B89B66 40%, #FFF8E7 50%, #B89B66 60%, #8A7347 100%)',
    goldShine: 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
    navyPanel: 'linear-gradient(180deg, rgba(0,29,61,0.8) 0%, rgba(0,8,20,0.95) 100%)',
  },
  
  // 上品なドロップシャドウ
  shadows: {
    goldAura: '0 0 20px rgba(247, 231, 206, 0.4), 0 0 40px rgba(247, 231, 206, 0.2)',
    boxNavy: '0 10px 30px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(247, 231, 206, 0.3)',
  },
  
  // 高級感のあるフォント設定
  fonts: {
    primary: `${cinzelFamily}, ${minchoFamily}, serif`,
    title: cinzelFamily,
    japanese: minchoFamily,
  }
};
