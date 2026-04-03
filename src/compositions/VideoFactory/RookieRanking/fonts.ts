/**
 * RookieRanking 全体で使用するフォントの読み込みと定義
 * 英語: Cinzel Decorative（古代ローマ体・高級感）
 * 日本語: BIZ UD Mincho（明朝体・品格）
 */
import { loadFont as loadCinzel } from '@remotion/google-fonts/CinzelDecorative';
import { loadFont as loadMincho } from '@remotion/google-fonts/BIZUDMincho';

const { fontFamily: cinzelFamily } = loadCinzel();
const { fontFamily: minchoFamily } = loadMincho();

/** 英語タイトル用（RANKING, CONGRATULATIONS など） */
export const LuxuryLatinFont = cinzelFamily;

/** 日本語テキスト用（新人王, 名前など） */
export const LuxuryJapaneseFont = minchoFamily;

/** 両方を組み合わせたフォントスタック */
export const LuxuryFontStack = `${cinzelFamily}, ${minchoFamily}, serif`;
