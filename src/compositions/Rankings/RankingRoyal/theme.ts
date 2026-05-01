import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadMincho } from '@remotion/google-fonts/ShipporiMincho';

const { fontFamily: cinzelFamily } = loadCinzel('normal', {
  weights: ['400', '700', '900'],
  ignoreTooManyRequestsWarning: true,
});
const { fontFamily: minchoFamily } = loadMincho('normal', {
  weights: ['400', '700', '800'],
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
    
    // 発光・シャドウ (より強く、純金に近い鮮やかさに)
    goldGlow: 'rgba(255, 215, 0, 0.8)',
    cyanGlow: 'rgba(0, 168, 255, 0.4)', // さりげない宝石の輝き
    
    textWhite: '#FFFFFF',
  },
  
  // ゴールドグラデーション (影を排除し、白と純金のみで構成)
  gradients: {
    goldLinear: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 25%, #FFF8E7 50%, #FFD700 75%, #FFFFFF 100%)',
    goldShine: 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
    navyPanel: 'linear-gradient(180deg, rgba(0,29,61,0.8) 0%, rgba(0, 20, 0, 0.95) 100%)',
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
