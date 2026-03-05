import fs from 'node:fs';
import path from 'node:path';
import { loadDefaultJapaneseParser } from 'budoux';

const parser = loadDefaultJapaneseParser();

// ログから抽出した字幕データ (Whisper出力)
const rawSegments = [
  {
    start: '00:09.400',
    end: '00:16.560',
    text: '誰かを想うたびに 背中を押す風が吹く',
  },
  {
    start: '00:17.720',
    end: '00:25.620',
    text: 'きっと怖かったんだ 本音がこぼれるのが',
  },
  {
    start: '00:26.860',
    end: '00:34.360',
    text: '言葉にすれば崩れそうで ずっと飲み込んできた',
  },
  {
    start: '00:34.360',
    end: '00:45.020',
    text: 'でも君は笑うから 不器用なままでいたいと思えた',
  },
  {
    start: '00:45.020',
    end: '00:52.720',
    text: '曖昧でも真っ直ぐでもない この距離がちょうどよかった',
  },
  {
    start: '00:52.720',
    end: '00:58.180',
    text: '君となら全部がちょっとマシに思える',
  },
  {
    start: '00:58.180',
    end: '01:03.660',
    text: '笑える理由が増えてゆく気がしてた',
  },
  {
    start: '01:03.660',
    end: '01:10.160',
    text: '涙の後さえバカにし合えるような',
  },
  { start: '01:10.960', end: '01:15.600', text: 'そんな時間が胸を締め付けた' },
  {
    start: '01:19.640',
    end: '01:26.500',
    text: '忘れようとした日々も 君がふとよぎるたび',
  },
  {
    start: '01:27.440',
    end: '01:35.700',
    text: '意味があったような気がして また前を向いてた',
  },
  {
    start: '01:35.700',
    end: '01:45.100',
    text: '名前さえも呼べなかった日々 今じゃ思い出に変わる',
  },
  {
    start: '01:45.100',
    end: '01:50.540',
    text: '君となら何度でも間違えていい',
  },
  {
    start: '01:50.540',
    end: '01:55.760',
    text: '遠回りだって悪くないと思えた',
  },
  {
    start: '01:55.760',
    end: '02:02.220',
    text: '正解なんてさ 後から追いついてくる',
  },
  { start: '02:02.220', end: '02:07.360', text: 'そんな風に君が変えたんだ' },
  {
    start: '02:07.360',
    end: '02:14.320',
    text: 'いつか終わるものなら それまで走ればいい',
  },
  {
    start: '02:15.280',
    end: '02:23.300',
    text: '繋いだ手が解けても 歩いてたことは消えない',
  },
  {
    start: '02:25.720',
    end: '02:31.060',
    text: '君となら痛みさえも意味になる',
  },
  {
    start: '02:31.060',
    end: '02:36.740',
    text: 'すれ違ったって また笑い合えるだろう',
  },
  {
    start: '02:36.740',
    end: '02:42.720',
    text: 'もう逃げないよ 君を守れるような',
  },
  {
    start: '02:42.720',
    end: '02:47.160',
    text: 'そんな僕でちゃんとありたいんだ',
  },
  {
    start: '02:48.320',
    end: '02:53.620',
    text: '君とならもう一度 信じてみたい',
  },
  { start: '02:53.620', end: '02:58.980', text: '誰でもない君と選びたい日々' },
  {
    start: '02:58.980',
    end: '03:05.200',
    text: '風が止んでも 歩いてゆけるように',
  },
  { start: '03:05.200', end: '03:10.340', text: 'この歌を今 届けたい' },
  { start: '03:38.720', end: '03:40.320', text: '君の歌を今 届けたい' },
];

// 時間変換ヘルパー (MM:SS.mmm -> seconds)
const parseTime = (timeStr: string) => {
  const [min, sec] = timeStr.split(':');
  return parseFloat(min) * 60 + parseFloat(sec);
};

// BudouXで分割する関数
const splitTextNaturally = (text: string, maxLen: number = 7) => {
  const chunks = parser.parse(text);
  const results: string[] = [];
  let current = '';

  for (const chunk of chunks) {
    if (current.length + chunk.length <= maxLen || current === '') {
      current += chunk;
    } else {
      results.push(current);
      current = chunk;
    }
  }
  if (current) results.push(current);
  // 空白除去
  return results.filter((s) => s.trim().length > 0);
};

const generate = () => {
  const finalList: { text: string; start: number; end: number }[] = [];

  rawSegments.forEach((seg) => {
    const segStart = parseTime(seg.start);
    const segEnd = parseTime(seg.end);

    finalList.push({
      text: seg.text, // そのままのテキストを使用 (分割なし)
      start: segStart,
      end: segEnd,
    });
  });

  const outputPath = path.join(
    process.cwd(),
    'src/compositions/Kimitonara/subtitles.json',
  );
  fs.writeFileSync(outputPath, JSON.stringify(finalList, null, 2));
  console.log(`✅ Subtitles generated at: ${outputPath}`);
};

generate();
