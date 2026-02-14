export interface LyricLine {
	text: string;
	startFrame: number;
	endFrame: number;
	style?: 'emotional' | 'cinematic' | 'pop';
	color?: string;
}

const FPS = 30;

export const LYRICS: LyricLine[] = [
	{ text: "人混みを避けるみたいに", startFrame: Math.round(10.64 * FPS), endFrame: Math.round(13.26 * FPS), style: "emotional" },
	{ text: "少しだけ歩幅を落とす", startFrame: Math.round(13.26 * FPS), endFrame: Math.round(15.76 * FPS), style: "emotional" },
	{ text: "派手な言葉は選ばない", startFrame: Math.round(15.76 * FPS), endFrame: Math.round(18.14 * FPS), style: "emotional" },
	{ text: "でも目線はちゃんと合ってる", startFrame: Math.round(18.14 * FPS), endFrame: Math.round(20.42 * FPS), style: "emotional" },
	{ text: "冗談に逃げた沈黙の後", startFrame: Math.round(20.42 * FPS), endFrame: Math.round(23.1 * FPS), style: "emotional" },
	{ text: "誰にも気づかれないところで", startFrame: Math.round(23.1 * FPS), endFrame: Math.round(25.78 * FPS), style: "emotional" },
	{ text: "歩いたままそっと埋めるような", startFrame: Math.round(25.78 * FPS), endFrame: Math.round(28.12 * FPS), style: "emotional" },
	{ text: "そんな仕草が残ってる", startFrame: Math.round(28.12 * FPS), endFrame: Math.round(30.54 * FPS), style: "emotional" },
	{ text: "大丈夫とは聞かないで", startFrame: Math.round(30.54 * FPS), endFrame: Math.round(33.22 * FPS), style: "emotional" },
	{ text: "答えが出るまで待てる人", startFrame: Math.round(33.22 * FPS), endFrame: Math.round(35.42 * FPS), style: "emotional" },
	{ text: "正しさよりも弱くを選ぶ癖があるみたいだ", startFrame: Math.round(35.42 * FPS), endFrame: Math.round(40.54 * FPS), style: "emotional" },
	{ text: "傷つけないためじゃなく", startFrame: Math.round(40.54 * FPS), endFrame: Math.round(42.98 * FPS), style: "emotional" },
	{ text: "逃げないためのチーム君", startFrame: Math.round(42.98 * FPS), endFrame: Math.round(45.32 * FPS), style: "emotional" },
	{ text: "その意味を後から知ることになる", startFrame: Math.round(45.32 * FPS), endFrame: Math.round(49.34 * FPS), style: "emotional" },
	{ text: "強く見せたいわけじゃない", startFrame: Math.round(50.699999999999996 * FPS), endFrame: Math.round(53.36 * FPS), style: "pop" },
	{ text: "弱さを隠すでもない", startFrame: Math.round(53.36 * FPS), endFrame: Math.round(55.92 * FPS), style: "pop" },
	{ text: "ただ無理をしない距離で", startFrame: Math.round(55.92 * FPS), endFrame: Math.round(58.18 * FPS), style: "pop" },
	{ text: "隣に立っている", startFrame: Math.round(58.18 * FPS), endFrame: Math.round(60.48 * FPS), style: "pop" },
	{ text: "気づけばもう助けられてる", startFrame: Math.round(60.48 * FPS), endFrame: Math.round(63.5 * FPS), style: "pop" },
	{ text: "形を持たないままで", startFrame: Math.round(63.5 * FPS), endFrame: Math.round(65.9 * FPS), style: "pop" },
	{ text: "抱きしめるよりも先に", startFrame: Math.round(65.9 * FPS), endFrame: Math.round(68.52 * FPS), style: "pop" },
	{ text: "呼吸を合わせてくる", startFrame: Math.round(68.52 * FPS), endFrame: Math.round(71.08 * FPS), style: "pop" },
	{ text: "名前をつけないままで", startFrame: Math.round(71.08 * FPS), endFrame: Math.round(73.38 * FPS), style: "pop" },
	{ text: "何も求めずに", startFrame: Math.round(73.38 * FPS), endFrame: Math.round(75.76 * FPS), style: "pop" },
	{ text: "守られていたことに", startFrame: Math.round(75.76 * FPS), endFrame: Math.round(78.62 * FPS), style: "emotional" },
	{ text: "後で気づく", startFrame: Math.round(78.62 * FPS), endFrame: Math.round(80.8 * FPS), style: "emotional" },
	{ text: "雨が降りそうな空を", startFrame: Math.round(81.52 * FPS), endFrame: Math.round(84.16 * FPS), style: "emotional" },
	{ text: "見上げて何も言わない", startFrame: Math.round(84.16 * FPS), endFrame: Math.round(86.38 * FPS), style: "emotional" },
	{ text: "傘を差し出す代わりに", startFrame: Math.round(86.38 * FPS), endFrame: Math.round(88.74 * FPS), style: "emotional" },
	{ text: "一歩影を寄せる", startFrame: Math.round(88.74 * FPS), endFrame: Math.round(90.52 * FPS), style: "emotional" },
	{ text: "期待しない振りが上手で", startFrame: Math.round(90.52 * FPS), endFrame: Math.round(93.44 * FPS), style: "emotional" },
	{ text: "失望もしない顔で", startFrame: Math.round(93.44 * FPS), endFrame: Math.round(95.74 * FPS), style: "emotional" },
	{ text: "それでもちゃんと", startFrame: Math.round(95.74 * FPS), endFrame: Math.round(97.18 * FPS), style: "emotional" },
	{ text: "人を信じている", startFrame: Math.round(97.18 * FPS), endFrame: Math.round(99.32 * FPS), style: "emotional" },
	{ text: "強く見せる必要もなく", startFrame: Math.round(100.75999999999999 * FPS), endFrame: Math.round(103.14 * FPS), style: "emotional" },
	{ text: "弱さを隠すこともなく", startFrame: Math.round(103.14 * FPS), endFrame: Math.round(105.48 * FPS), style: "emotional" },
	{ text: "ただ自分の速度で", startFrame: Math.round(105.48 * FPS), endFrame: Math.round(107.4 * FPS), style: "emotional" },
	{ text: "同じ方を向いてる", startFrame: Math.round(107.4 * FPS), endFrame: Math.round(109.32 * FPS), style: "emotional" },
	{ text: "言葉より先に支えてくる", startFrame: Math.round(110.46 * FPS), endFrame: Math.round(113.56 * FPS), style: "cinematic" },
	{ text: "音を立てないままで", startFrame: Math.round(113.56 * FPS), endFrame: Math.round(115.9 * FPS), style: "cinematic" },
	{ text: "触れたことさえ忘れるほど", startFrame: Math.round(115.9 * FPS), endFrame: Math.round(118.5 * FPS), style: "cinematic" },
	{ text: "自然に寄り添う", startFrame: Math.round(118.5 * FPS), endFrame: Math.round(120.54 * FPS), style: "cinematic" },
	{ text: "答えを急がないままで", startFrame: Math.round(120.54 * FPS), endFrame: Math.round(123.44 * FPS), style: "cinematic" },
	{ text: "選ぶ自由ごと", startFrame: Math.round(123.44 * FPS), endFrame: Math.round(125.42 * FPS), style: "cinematic" },
	{ text: "差し出されていたことを", startFrame: Math.round(125.42 * FPS), endFrame: Math.round(128.58 * FPS), style: "emotional" },
	{ text: "今になって知る", startFrame: Math.round(128.58 * FPS), endFrame: Math.round(130.5 * FPS), style: "emotional" },
	{ text: "優しいって言葉じゃ", startFrame: Math.round(130.5 * FPS), endFrame: Math.round(133.78 * FPS), style: "pop" },
	{ text: "足りない理由が", startFrame: Math.round(133.78 * FPS), endFrame: Math.round(136.0 * FPS), style: "pop" },
	{ text: "今なら少しわかる", startFrame: Math.round(136.0 * FPS), endFrame: Math.round(141.52 * FPS), style: "pop" },
	{ text: "奪わないこと", startFrame: Math.round(141.52 * FPS), endFrame: Math.round(143.54 * FPS), style: "pop" },
	{ text: "決めつけないこと", startFrame: Math.round(143.54 * FPS), endFrame: Math.round(145.82 * FPS), style: "pop" },
	{ text: "信じて待つこと", startFrame: Math.round(145.82 * FPS), endFrame: Math.round(149.04 * FPS), style: "pop" },
	{ text: "踏み込まずに", startFrame: Math.round(153.95999999999998 * FPS), endFrame: Math.round(155.44 * FPS), style: "pop" },
	{ text: "寄り添うやり方", startFrame: Math.round(155.44 * FPS), endFrame: Math.round(157.06 * FPS), style: "emotional" },
	{ text: "境界線を越えずに", startFrame: Math.round(157.06 * FPS), endFrame: Math.round(159.76 * FPS), style: "emotional" },
	{ text: "触れないことで", startFrame: Math.round(159.76 * FPS), endFrame: Math.round(162.22 * FPS), style: "emotional" },
	{ text: "近くにいる", startFrame: Math.round(162.22 * FPS), endFrame: Math.round(164.14 * FPS), style: "emotional" },
	{ text: "光らないままで", startFrame: Math.round(164.14 * FPS), endFrame: Math.round(166.68 * FPS), style: "emotional" },
	{ text: "生活の一部みたいに", startFrame: Math.round(166.68 * FPS), endFrame: Math.round(169.04 * FPS), style: "emotional" },
	{ text: "当たり前として", startFrame: Math.round(169.6 * FPS), endFrame: Math.round(171.18 * FPS), style: "emotional" },
	{ text: "続いていく", startFrame: Math.round(171.18 * FPS), endFrame: Math.round(172.82 * FPS), style: "emotional" },
	{ text: "それが優しさ", startFrame: Math.round(173.88 * FPS), endFrame: Math.round(175.46 * FPS), style: "emotional" },
	{ text: "特別じゃない顔で", startFrame: Math.round(175.46 * FPS), endFrame: Math.round(177.34 * FPS), style: "emotional" },
	{ text: "僕の日常の角を", startFrame: Math.round(177.34 * FPS), endFrame: Math.round(179.86 * FPS), style: "emotional" },
	{ text: "静かに丸める", startFrame: Math.round(179.86 * FPS), endFrame: Math.round(182.22 * FPS), style: "emotional" },
	{ text: "後から胸に響く", startFrame: Math.round(182.22 * FPS), endFrame: Math.round(184.2 * FPS), style: "emotional" },
	{ text: "それが優しさ", startFrame: Math.round(184.2 * FPS), endFrame: Math.round(185.46 * FPS), style: "emotional" },
	{ text: "残らないはずなのに", startFrame: Math.round(185.46 * FPS), endFrame: Math.round(187.4 * FPS), style: "emotional" },
	{ text: "振り返るたび", startFrame: Math.round(187.4 * FPS), endFrame: Math.round(189.22 * FPS), style: "emotional" },
	{ text: "確かにそこにある", startFrame: Math.round(189.22 * FPS), endFrame: Math.round(193.12 * FPS), style: "emotional" },
	{ text: "でも", startFrame: Math.round(221.2 * FPS), endFrame: Math.round(222.6 * FPS), style: "emotional" },
	{ text: "", startFrame: Math.round(222.58 * FPS), endFrame: Math.round(222.58 * FPS), style: "emotional" },
];

/**
 * Lyric Groups & Character Assignments for Image Generation
 * 
 * Strategy: "Memories Album" - Frequent cuts to show various moments.
 * Characters: Nova (Purple), Yuka (Pink), Rin (Light Blue), Shiori (Green), Asuka (Yellow)
 * 
 * 1 Group = 1 generated image.
 */
export const LYRIC_GROUPS = [
    // A-Melo 1: Introduction - Quiet, Daily Life (Focus: Nova's Solitude)
    { lines: [0], char: "Nova", prompt: "walking alone in the crowd, looking down, melancholic, city street, daytime, soft lighting" }, // 人混みを避けるみたいに
    { lines: [1], char: "Nova", prompt: "slowing down pace, thoughtful expression, street background" }, // 少しだけ歩幅を落とす
    { lines: [2], char: "Nova", prompt: "reading a book alone in a cafe, quiet atmosphere, sunlight through window" }, // 派手な言葉は選ばない
    { lines: [3], char: "Nova", prompt: "looking straight into camera, gentle smile, eye contact, close up" }, // でも目線はちゃんと合ってる

    // A-Melo 2: Interaction (Nova observing others)
    { lines: [4], char: "Yuka", prompt: "awkward smile, trying to hide embarrassment, sunset classroom" }, // 冗談に逃げた沈黙の後
    { lines: [5], char: "Nova", prompt: "watching from a distance, caring expression, peaceful" }, // 誰にも気づかれないところで
    { lines: [6, 7], char: "Nova & Shiori", prompt: "walking softly together, Nova leading, forest path" }, // 歩いたまま〜仕草が残ってる

    // B-Melo: Inner Feelings (Nova's perspective)
    { lines: [8], char: "Asuka", prompt: "looking worried, hand reaching out to Nova" }, // 大丈夫とは聞かないで
    { lines: [9], char: "Nova", prompt: "receiving kindness, slightly surprised face" }, // 答えが出るまで待てる人
    { lines: [10], char: "Nova", prompt: "choosing to be weak/vulnerable, bittersweet smile, rainy window" }, // 正しさよりも〜癖があるみたいだ
    { lines: [11, 12], char: "Nova & Rin", prompt: "Rin standing beside Nova, supportive stance, team spirit" }, // 傷つけないため〜チーム君
    { lines: [13], char: "All (Center: Nova)", prompt: "group photo style, everyone looking at Nova, realization" }, // その意味を後から知ることになる

    // Chorus 1: The Bond (Nova & Friends)
    { lines: [14], char: "Nova", prompt: "trying to look strong but failing, emotional, close up" }, // 強く見せたいわけじゃない
    { lines: [15], char: "Nova", prompt: "showing vulnerability, honest expression, tears maybe?" }, // 弱さを隠すでもない
    { lines: [16, 17], char: "Nova & Asuka", prompt: "walking side by side, Asuka smiling at Nova" }, // ただ無理をしない距離で〜隣に立っている
    { lines: [18], char: "Nova & Rin", prompt: "Rin pulling Nova up by hand, bright sky" }, // 気づけばもう助けられてる
    { lines: [19], char: "All (Center: Nova)", prompt: "abstract representation of bond, shapeless but warm" }, // 形を持たないままで
    { lines: [20, 21], char: "Nova & Yuka", prompt: "Yuka hugging Nova, synchronizing breathing, peace" }, // 抱きしめるよりも〜呼吸を合わせてくる
    { lines: [22, 23], char: "Nova", prompt: "smiling naturally, surrounded by warm light" }, // 名前をつけないままで〜何も求めずに
    { lines: [24, 25], char: "Nova", prompt: "realizing something important, looking up at sky, gratitude" }, // 守られていた〜後で気づく

    // A-Melo 3: Rainy Scene (Nova & Rain)
    { lines: [26], char: "Nova", prompt: "looking up at cloudy sky, about to rain, city landscape" }, // 雨が降りそうな空を
    { lines: [27], char: "Nova", prompt: "silently watching, stoic but kind" }, // 見上げて何も言わない
    { lines: [28], char: "Shiori", prompt: "offering umbrella to Nova, hesitating kindness" }, // 傘を差し出す代わりに
    { lines: [29], char: "Nova & Shiori", prompt: "sharing umbrella, stepping closer into shadow" }, // 一歩影を寄せる

    // B-Melo 2 (Nova's appreciation)
    { lines: [30], char: "Yuka", prompt: "pretending not to expect anything, looking away shyly" }, // 期待しない振りが上手で
    { lines: [31], char: "Nova", prompt: "watching Yuka with a knowing smile" }, // 失望もしない顔で
    { lines: [32, 33], char: "Nova", prompt: "strong belief, looking forward, determination" }, // それでもちゃんと〜人を信じている

    // Chorus 2 (Nova surrounded by kindness)
    { lines: [34], char: "Nova", prompt: "natural stance, not showing off strength, wind blowing hair" }, // 強く見せる必要もなく
    { lines: [35], char: "Nova", prompt: "open and honest, hiding nothing, bright eyes" }, // 弱さを隠すこともなく
    { lines: [36, 37], char: "Nova & Rin", prompt: "walking at own speed, Rin matching pace" }, // ただ自分の速度で〜同じ方を向いてる
    { lines: [38], char: "Nova & Shiori", prompt: "Shiori supporting from behind, reliable" }, // 言葉より先に支えてくる
    { lines: [39], char: "Nova", prompt: "feeling the silent support, closed eyes" }, // 音を立てないままで
    { lines: [40, 41], char: "Nova & Yuka", prompt: "touching shoulders naturally, very close" }, // 触れたことさえ〜自然に寄り添う
    { lines: [42], char: "All (Center: Nova)", prompt: "waiting together, relaxed atmosphere" }, // 答えを急がないままで
    { lines: [43], char: "All (Center: Nova)", prompt: "accepting choices, freedom, wide open space" }, // 選ぶ自由ごと
    { lines: [44, 45], char: "Nova", prompt: "realization struck, emotional tears, happy tears" }, // 差し出されていた〜今になって知る

    // Bridge / Last Chorus (Nova's definition of kindness)
    { lines: [46], char: "Nova (Childhood?)", prompt: "flashback? young Nova, warm light" }, // 優しいって言葉じゃ
    { lines: [47, 48], char: "Nova", prompt: "understanding now, nodding, gentle smile" }, // 足りない理由が〜今なら少しわかる
    { lines: [49], char: "Rin", prompt: "Rin's hand offering something to Nova" }, // 奪わないこと
    { lines: [50], char: "Shiori", prompt: "Shiori nodding at Nova" }, // 決めつけないこと
    { lines: [51], char: "Asuka", prompt: "Asuka waiting for Nova on a bench" }, // 信じて待つこと
    { lines: [52, 53], char: "Yuka", prompt: "Yuka standing close but respectful distance" }, // 踏み込まずに〜寄り添うやり方
    { lines: [54, 55], char: "Nova", prompt: "bowing slightly in thanks to friends" }, // 境界線を越えずに〜触れないことで
    { lines: [56], char: "All (Center: Nova)", prompt: "being nearby, surrounding Nova, group hug" }, // 近くにいる

    // Outro (Nova's conclusion)
    { lines: [57, 58], char: "Nova", prompt: "standing in light, part of the scenery" }, // 光らないままで〜生活の一部みたいに
    { lines: [59, 60], char: "Nova", prompt: "daily life scene, cooking or reading, peaceful" }, // 当たり前として〜続いていく
    { lines: [61], char: "Nova", prompt: "title card style? 'That is Kindness', smiling at camera" }, // それでも優しさ
    { lines: [62], char: "Asuka", prompt: "ordinary face, looking at Nova with kindness" }, // 特別じゃない顔で
    { lines: [63, 64], char: "Nova", prompt: "soft focus, gentle atmosphere" }, // 僕の日常の角を〜静かに丸める
    { lines: [65], char: "Nova", prompt: "hand on chest, feeling resonance" }, // 後から胸に響く
    { lines: [66], char: "All (Center: Nova)", prompt: "group shot back view, looking at sunset" }, // それが優しさ
    { lines: [67], char: "Rin", prompt: "Rin leaving frame but waving" }, // 残らないはずなのに
    { lines: [68], char: "Nova", prompt: "looking back over shoulder, smiling" }, // 振り返るたび
    { lines: [69], char: "Nova", prompt: "pointing at heart, it's there" }, // 確かにそこにある
    { lines: [70], char: "Nova", prompt: "daily life scene, cooking or reading, peaceful" }, // 生活の一部みたいに
    { lines: [71, 72], char: "Nova", prompt: "standing natural, accepting the flow of time" }, // 当たり前として〜続いていく
];
