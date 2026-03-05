import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// 仮想環境のパス (プロジェクトルートからの相対パス)
const VENV_WHISPER = path.join(process.cwd(), 'venv-whisper/bin/whisper');

const transcribeAudio = () => {
  const audioInputPath = process.argv[2];
  const outputDir = process.argv[3];

  if (!audioInputPath || !outputDir) {
    console.error(
      '❌ Usage: npx tsx scripts/transcribe_audio.ts <audio_path> <output_dir>',
    );
    process.exit(1);
  }

  const absoluteInputPath = path.isAbsolute(audioInputPath)
    ? audioInputPath
    : path.join(process.cwd(), audioInputPath);

  const absoluteOutputDir = path.isAbsolute(outputDir)
    ? outputDir
    : path.join(process.cwd(), outputDir);

  console.log(`🚀 音声解析を開始します: ${absoluteInputPath}`);

  if (!fs.existsSync(absoluteInputPath)) {
    console.error('❌ 音声ファイルが見つかりません:', absoluteInputPath);
    process.exit(1);
  }

  if (!fs.existsSync(absoluteOutputDir)) {
    fs.mkdirSync(absoluteOutputDir, { recursive: true });
  }

  const tempAudioPath = path.join(process.cwd(), `temp_${Date.now()}.wav`);

  try {
    // 1. 音声整形 (ffmpeg) - Whisper推奨の16kHz mono WAVに変換
    console.log('🎵 音声を整形中 (WAV 16kHz mono)...');
    execSync(
      `npx remotion ffmpeg -i "${absoluteInputPath}" -ar 16000 -ac 1 -y "${tempAudioPath}"`,
      { stdio: 'inherit' },
    );

    // 2. ローカルWhisper実行
    console.log('☁️  ローカルWhisper (Turboモデル) で解析中...');
    execSync(
      `${VENV_WHISPER} "${tempAudioPath}" --model turbo --language ja --output_format json --output_dir "${absoluteOutputDir}" --word_timestamps True`,
      { stdio: 'inherit' },
    );

    // 3. ファイルのリネーム (temp_*.json -> subtitles.json)
    const tempJsonName = path.basename(tempAudioPath).replace('.wav', '.json');
    const generatedJsonPath = path.join(absoluteOutputDir, tempJsonName);
    const finalJsonPath = path.join(absoluteOutputDir, 'subtitles.json');

    if (fs.existsSync(generatedJsonPath)) {
      fs.renameSync(generatedJsonPath, finalJsonPath);
      console.log(`✅ 解析完了: ${finalJsonPath}`);
    } else {
      // 一部のWhisper環境では入力ファイル名そのままのjsonが出る場合がある
      console.error(
        '❌ 解析結果ファイルが見つかりませんでした。出力ディレクトリを確認してください。',
      );
    }

    // 4. 後片付け
    if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
    console.log('✨ 全ての処理が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
    process.exit(1);
  }
};

transcribeAudio();
