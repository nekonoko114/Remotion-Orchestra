import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { loadDefaultJapaneseParser } from 'budoux';

const parser = loadDefaultJapaneseParser();

// 仮想環境のパス (プロジェクトルートからの相対パス)
const VENV_WHISPER = path.join(process.cwd(), 'venv-whisper/bin/whisper');

/**
 * BudouXを使用して、意味の切れ目を守りつつ適切な長さで区切る
 */
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
  return results;
};

/**
 * メインの文字起こし関数
 * @param inputPath 入力ファイルパス (動画または音声)
 * @param outputDir 出力ディレクトリ
 */
const transcribe = (inputPath: string, outputDir: string) => {
  console.log(`🚀 文字起こしを開始します: ${inputPath}`);

  const extension = path.extname(inputPath).toLowerCase();
  const isAudio = ['.mp3', '.wav', '.m4a', '.flac'].includes(extension);
  const audioPath = path.join(process.cwd(), `temp_audio_${Date.now()}.wav`);

  if (!fs.existsSync(inputPath)) {
    console.error('❌ 入力ファイルが見つかりません:', inputPath);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 1. 音声抽出/変換 (ffmpeg)
    // Whisperは16kHz monoのWAVを好むため、一律変換する
    console.log('🎵 音声を変換中 (WAV 16kHz mono)...');
    execSync(
      `npx remotion ffmpeg -i "${inputPath}" -ar 16000 -ac 1 -y "${audioPath}"`,
      { stdio: 'inherit' }
    );

    // 2. ローカルWhisper実行
    console.log('☁️  ローカルWhisper (Turboモデル) で解析中...');
    const tempJsonBase = path.basename(audioPath, '.wav');
    execSync(
      `${VENV_WHISPER} "${audioPath}" --model turbo --language ja --output_format json --output_dir "${outputDir}" --word_timestamps True`,
      { stdio: 'inherit' }
    );

    // Whisperの出力ファイル名は入力ファイル名に依存する
    const tempJsonPath = path.join(outputDir, `${tempJsonBase}.json`);
    const finalJsonPath = path.join(outputDir, 'subtitles.json');

    // 3. BudouXによる自然な整形
    if (fs.existsSync(tempJsonPath)) {
      const rawData = JSON.parse(fs.readFileSync(tempJsonPath, 'utf-8'));
      const allWords = rawData.segments.flatMap((s: any) => s.words || []);

      if (allWords.length === 0) {
        console.warn('⚠️  単語レベルのタイムスタンプが見つかりませんでした。セグメント単位で処理します。');
        // フォールバック処理
        const processedSubtitles = rawData.segments.map((s: any) => ({
          text: s.text.trim(),
          start: s.start,
          end: s.end,
        }));
        fs.writeFileSync(finalJsonPath, JSON.stringify(processedSubtitles, null, 2));
      } else {
        const fullText = rawData.text.replace(/ /g, ''); // Whisperの空白を除去
        const semanticChunks = splitTextNaturally(fullText, 7);

        let wordIdx = 0;
        const processedSubtitles = semanticChunks.map((chunkText) => {
          let start = -1;
          let end = -1;
          let collected = '';

          while (
            wordIdx < allWords.length &&
            collected.length < chunkText.length
          ) {
            const w = allWords[wordIdx];
            if (start === -1) start = w.start;
            end = w.end;
            collected += w.word.trim();
            wordIdx++;
          }

          return {
            text: chunkText,
            start,
            end,
          };
        });

        fs.writeFileSync(
          finalJsonPath,
          JSON.stringify(processedSubtitles, null, 2),
        );
      }
      
      console.log(`✅ 字幕ファイルの生成が完了しました: ${finalJsonPath}`);
      fs.unlinkSync(tempJsonPath);
    } else {
      console.error('❌ Whisperの出力ファイルが見つかりません:', tempJsonPath);
    }

    // 4. 後片付け
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    console.log('✨ 全ての処理が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    process.exit(1);
  }
};

// 引数処理: tsx transcribe-local.ts [inputPath] [outputDir]
const args = process.argv.slice(2);
const defaultInput = path.join(process.cwd(), 'public/liver-formatter/video/test-video.MOV');
const defaultOutput = path.join(process.cwd(), 'src/compositions/Soregayasashisa');

const inputPath = args[0] || defaultInput;
const outputDir = args[1] || defaultOutput;

transcribe(inputPath, outputDir);
