export interface LyricLine {
  text: string;
  startFrame: number;
  endFrame: number;
  style?: 'emotional' | 'cinematic' | 'pop';
  color?: string; // Optional color for Pop style (e.g., 'purple' or 'white')
}

const FPS = 30;

// OpenAI Whisper による解析結果から生成（music_analysis.json）
export const LYRICS: LyricLine[] = [
  // A-Melo / B-Melo (Emotional - Default)
  {
    text: 'あなたは少し早起きで',
    startFrame: Math.round(0.0 * FPS),
    endFrame: Math.round(3.3 * FPS),
    style: 'emotional',
  },
  {
    text: '私は最後まで夢の中',
    startFrame: Math.round(3.3 * FPS),
    endFrame: Math.round(6.1 * FPS),
    style: 'emotional',
  },
  {
    text: '同じ朝じゃなくても',
    startFrame: Math.round(6.1 * FPS),
    endFrame: Math.round(9.2 * FPS),
    style: 'emotional',
  },
  {
    text: '同じ場所に戻ってくる',
    startFrame: Math.round(9.2 * FPS),
    endFrame: Math.round(12.0 * FPS),
    style: 'emotional',
  },
  {
    text: '選ぶ服も考え方も',
    startFrame: Math.round(12.5 * FPS),
    endFrame: Math.round(15.5 * FPS),
    style: 'emotional',
  },
  {
    text: '似ていないところばかり',
    startFrame: Math.round(15.5 * FPS),
    endFrame: Math.round(18.3 * FPS),
    style: 'emotional',
  },
  {
    text: 'それなのに不思議と',
    startFrame: Math.round(18.3 * FPS),
    endFrame: Math.round(21.5 * FPS),
    style: 'emotional',
  },
  {
    text: '迷う理由にはならなかった',
    startFrame: Math.round(21.5 * FPS),
    endFrame: Math.round(23.8 * FPS),
    style: 'emotional',
  },
  {
    text: '合わせることより',
    startFrame: Math.round(24.0 * FPS),
    endFrame: Math.round(26.8 * FPS),
    style: 'emotional',
  },
  {
    text: '離れないことを知った',
    startFrame: Math.round(26.8 * FPS),
    endFrame: Math.round(30.0 * FPS),
    style: 'cinematic',
  }, // Key realization

  // Chorus (Pop - Energetic)
  {
    text: '並んだままで歩いてる',
    startFrame: Math.round(30.4 * FPS),
    endFrame: Math.round(33.5 * FPS),
    style: 'pop',
    color: 'purple',
  },
  {
    text: '同じ速さじゃなくても',
    startFrame: Math.round(33.5 * FPS),
    endFrame: Math.round(36.8 * FPS),
    style: 'pop',
    color: 'white',
  },
  {
    text: '言葉にしない想いが',
    startFrame: Math.round(36.8 * FPS),
    endFrame: Math.round(39.5 * FPS),
    style: 'pop',
    color: 'purple',
  },
  {
    text: 'ちゃんと届いている',
    startFrame: Math.round(39.5 * FPS),
    endFrame: Math.round(42.2 * FPS),
    style: 'pop',
    color: 'purple',
  },

  // Verse 2 (Emotional)
  {
    text: '息がぶつかる夜も',
    startFrame: Math.round(42.5 * FPS),
    endFrame: Math.round(45.0 * FPS),
    style: 'emotional',
  },
  {
    text: '黙ったままの帰り道も',
    startFrame: Math.round(45.0 * FPS),
    endFrame: Math.round(47.8 * FPS),
    style: 'emotional',
  },
  {
    text: '終わりを考えないで',
    startFrame: Math.round(47.8 * FPS),
    endFrame: Math.round(51.0 * FPS),
    style: 'emotional',
  },
  {
    text: 'また明日を置いて眠る',
    startFrame: Math.round(51.0 * FPS),
    endFrame: Math.round(53.8 * FPS),
    style: 'emotional',
  },
  {
    text: '確かめなくても',
    startFrame: Math.round(54.8 * FPS),
    endFrame: Math.round(60.0 * FPS),
    style: 'emotional',
  },
  {
    text: '選び続けていた',
    startFrame: Math.round(60.0 * FPS),
    endFrame: Math.round(66.0 * FPS),
    style: 'emotional',
  },

  // Chorus 2 (Pop)
  {
    text: '並んだままで今日を行く',
    startFrame: Math.round(66.2 * FPS),
    endFrame: Math.round(69.0 * FPS),
    style: 'pop',
    color: 'purple',
  },
  {
    text: '揃わない答えを抱いて',
    startFrame: Math.round(69.0 * FPS),
    endFrame: Math.round(71.8 * FPS),
    style: 'pop',
    color: 'white',
  },
  {
    text: '当たり前に重なる',
    startFrame: Math.round(72.1 * FPS),
    endFrame: Math.round(75.0 * FPS),
    style: 'pop',
    color: 'purple',
  },
  {
    text: '何気ない一日がある',
    startFrame: Math.round(75.0 * FPS),
    endFrame: Math.round(77.8 * FPS),
    style: 'pop',
    color: 'white',
  },

  // Bridge (Cinematic/Emotional mix)
  {
    text: 'もし遠回りに見えても',
    startFrame: Math.round(77.9 * FPS),
    endFrame: Math.round(81.0 * FPS),
    style: 'cinematic',
  },
  {
    text: 'ここまで来た足跡は',
    startFrame: Math.round(81.0 * FPS),
    endFrame: Math.round(84.3 * FPS),
    style: 'cinematic',
  },
  {
    text: '二人で刻んだものだと',
    startFrame: Math.round(84.3 * FPS),
    endFrame: Math.round(89.0 * FPS),
    style: 'cinematic',
  },
  {
    text: '胸を張って言える',
    startFrame: Math.round(89.0 * FPS),
    endFrame: Math.round(93.2 * FPS),
    style: 'pop',
    color: 'purple',
  }, // Build up

  // Final Chorus (Pop)
  {
    text: '並んだままで笑ってる',
    startFrame: Math.round(93.2 * FPS),
    endFrame: Math.round(96.3 * FPS),
    style: 'pop',
    color: 'purple',
  },
  {
    text: '特別じゃない時間の中',
    startFrame: Math.round(96.3 * FPS),
    endFrame: Math.round(99.3 * FPS),
    style: 'pop',
    color: 'white',
  },
  {
    text: '守りたい理由が',
    startFrame: Math.round(99.3 * FPS),
    endFrame: Math.round(102.5 * FPS),
    style: 'pop',
    color: 'purple',
  },
  {
    text: '増えていくことが嬉しい',
    startFrame: Math.round(102.5 * FPS),
    endFrame: Math.round(105.7 * FPS),
    style: 'pop',
    color: 'white',
  },

  // Outro (Cinematic)
  {
    text: '並んだままでここにいる',
    startFrame: Math.round(105.7 * FPS),
    endFrame: Math.round(108.5 * FPS),
    style: 'cinematic',
  },
  {
    text: '歓声を急がなくても',
    startFrame: Math.round(108.5 * FPS),
    endFrame: Math.round(111.6 * FPS),
    style: 'cinematic',
  },
  {
    text: 'この日々がいつの間にか',
    startFrame: Math.round(111.6 * FPS),
    endFrame: Math.round(114.0 * FPS),
    style: 'cinematic',
  },
  {
    text: '帰る場所になっていた',
    startFrame: Math.round(114.0 * FPS),
    endFrame: Math.round(116.6 * FPS),
    style: 'cinematic',
  },
];
