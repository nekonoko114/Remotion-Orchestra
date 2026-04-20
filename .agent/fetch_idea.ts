
import axios from 'axios';

const url = 'http://192.168.3.147:1234/v1/chat/completions';
const data = {
  model: 'deepseek-coder-v2-lite-instruct',
  messages: [
    { role: 'system', content: 'あなたはRemotionビデオ製作のクリエイティブディレクターです。' },
    { role: 'user', content: '「DeepSeekとAntigravityのコラボレーション」というテーマで、以下の構成のビデオ構成案（各シーンのタイトル、表示するテキスト、推奨する背景色）を日本語で提案してください。構成：Opening, Scene1, Scene2, Ending' }
  ],
  temperature: 0.7
};

async function getDeepSeekIdea() {
  try {
    const response = await axios.post(url, data);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getDeepSeekIdea();
