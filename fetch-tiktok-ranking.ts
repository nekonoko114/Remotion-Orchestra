/**
 * 3月度ランキング対象IDのTikTokプロフィール画像を再取得するスクリプト
 * Usage: npx ts-node fetch-tiktok-ranking.ts
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { chromium } from 'playwright';

// ============================================================
// 3月度ランキング登場ライバーのID一覧
// ============================================================
const RANKING_IDS = [
  // 新人王
  'mizuki2525214',      // 1位 一条美月
  'user58402831659341', // 2位 ぼく天然ミッキー
  '2161646824',         // 3位 まゆみ (前回 Not Found)

  // 配信時間ランキング
  // '2161646824' already above
  'donbeikun9999',      // 2位 やらかしタロー
  'karaindaisuki',      // 3位 なるりれ
  't.o.p_u_jin_',       // 4位 ユージン
  // 'mizuki2525214' already above
  // 6位 小悪魔 → IDなしのためスキップ
  'yyuukkii0402',       // 7位 yukiんこ
  'ceo1014',            // 8位 CEO
  'l5332541',           // 9位 さくら
  'ikkurrex7ja',        // 10位 そら

  // ダイヤモンドランキング
  // 'l5332541' already above
  // 'mizuki2525214' already above
  // 't.o.p_u_jin_' already above
  // 6位 小悪魔 → IDなしのためスキップ
  'ooo93o',             // 5位 あむら
  'mrm0115',            // 6位 限界突破まみ
  'ria.kangoshi',       // 7位 りあ (新規ID)
  // 'donbeikun9999' already above
  // 'user58402831659341' already above
  // 'karaindaisuki' already above

  // 団結NO1ランキング
  // 'mizuki2525214' above
  // 'donbeikun9999' above
  // 't.o.p_u_jin_' above
  // '2161646824' above
  // 'l5332541' above
  // 'karaindaisuki' above
  // 'mrm0115' above
  // 'ceo1014' above
  // 'ria.kangoshi' above
  // 'ikkurrex7ja' above
  'butterfly46490',     // 11位 でっちゃん
  // 'yyuukkii0402' above
  'user9577863834239',  // 13位 マッサ
  // 'user58402831659341' above
  // 'ooo93o' above
];

// 重複除去
const UNIQUE_IDS = [...new Set(RANKING_IDS)];

const downloadImage = (url: string, filepath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.tiktok.com/',
      },
    };

    https.get(options, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve());
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        if (res.headers.location) {
          downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        } else {
          reject(new Error(`Redirect without location header`));
        }
      } else {
        res.resume();
        reject(new Error(`Request Failed With Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

const getTikTokProfile = async (browser: any, username: string) => {
  const url = `https://www.tiktok.com/@${username}`;
  const avatarDir = path.join(process.cwd(), 'public/assets/avatars');

  if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
  }

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'ja-JP',
  });
  const page = await context.newPage();

  try {
    console.log(`  → ${url} にアクセス中...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    const html = await page.content();

    // Method 1: __UNIVERSAL_DATA_FOR_REHYDRATION__ から抽出
    const match = html.match(
      /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"([^>]*)>([^<]+)<\/script>/,
    );

    let nickname = 'Not Found';
    let avatarUrl = '';

    if (match && match[2]) {
      try {
        const data = JSON.parse(match[2]);
        const userModule = data?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user;
        if (userModule) {
          nickname = userModule.nickname || username;
          avatarUrl =
            userModule.avatarLarger ||
            userModule.avatarMedium ||
            userModule.avatarThumb ||
            '';
          console.log(`  ✓ JSON抽出成功: ${nickname}`);
        }
      } catch (e) {
        console.error(`  ✗ JSON解析失敗: ${username}`);
      }
    }

    // Method 2: DOMから画像を取得
    if (!avatarUrl) {
      console.log(`  → DOM抽出にフォールバック: ${username}`);
      const imgLocator = page.locator('img[src*="tiktokcdn"]');
      if ((await imgLocator.count()) > 0) {
        const src = await imgLocator.first().getAttribute('src');
        if (src && !src.includes('data:image')) {
          avatarUrl = src;
          console.log(`  ✓ DOM抽出成功`);
        }
      }

      const h1Locator = page.locator('h1[data-e2e="user-title"]');
      if ((await h1Locator.count()) > 0) {
        const text = await h1Locator.first().textContent();
        if (text) nickname = text.trim();
      }
    }

    await context.close();

    if (avatarUrl) {
      const ext = 'jpg';
      const localFilename = `${username}.${ext}`;
      const localPath = path.join(avatarDir, localFilename);
      const publicPath = `/assets/avatars/${localFilename}`;

      try {
        console.log(`  → アバター画像をダウンロード中...`);
        await downloadImage(avatarUrl, localPath);
        console.log(`  ✓ 保存完了: ${localPath}`);
        return { id: username, nickname, avatar: avatarUrl, localAvatar: publicPath };
      } catch (downloadErr) {
        console.error(`  ✗ ダウンロード失敗:`, downloadErr);
        return { id: username, nickname, avatar: avatarUrl, localAvatar: '' };
      }
    }

    console.log(`  ✗ アバターURL取得不可: ${username}`);
    return { id: username, nickname, avatar: '', localAvatar: '' };
  } catch (err: any) {
    console.error(`  ✗ エラー: ${username} - ${err.message}`);
    await context.close();
    return { id: username, nickname: 'Browser Error', avatar: '', localAvatar: '' };
  }
};

const main = async () => {
  console.log(`\n=== 3月度ランキング TikTokプロフィール取得スクリプト ===`);
  console.log(`取得対象: ${UNIQUE_IDS.length}件\n`);

  // 既存のjol-liver.jsonを読み込んで、既存データをマップに保持
  let existingData: Record<string, any> = {};
  if (fs.existsSync('jol-liver.json')) {
    const existing = JSON.parse(fs.readFileSync('jol-liver.json', 'utf8')) as any[];
    for (const item of existing) {
      existingData[item.id] = item;
    }
    console.log(`既存データ読み込み: ${existing.length}件\n`);
  }

  const browser = await chromium.launch({ headless: true });
  const results: any[] = [];

  for (let i = 0; i < UNIQUE_IDS.length; i++) {
    const id = UNIQUE_IDS[i];
    console.log(`\n[${i + 1}/${UNIQUE_IDS.length}] 処理中: @${id}`);

    const data = await getTikTokProfile(browser, id);
    results.push(data);

    // リクエスト間に待機（レート制限対策）
    if (i < UNIQUE_IDS.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  await browser.close();

  // jol-liver.jsonの既存データを更新（今回取得したIDを上書き）
  for (const newItem of results) {
    existingData[newItem.id] = newItem;
  }

  const updatedAll = Object.values(existingData);
  fs.writeFileSync('jol-liver.json', JSON.stringify(updatedAll, null, 2));

  // 今回取得分だけを ranking-march-2025.json として保存
  fs.writeFileSync(
    'ranking-march-profiles.json',
    JSON.stringify(results, null, 2),
  );

  console.log('\n=== 完了 ===');
  console.log(`jol-liver.json 更新済み (${updatedAll.length}件)`);
  console.log(`ranking-march-profiles.json 保存済み (${results.length}件)`);
  console.log('\n取得結果サマリー:');
  for (const r of results) {
    const status = r.localAvatar ? '✓' : '✗';
    console.log(`  ${status} @${r.id} → ${r.nickname}`);
  }
};

main().catch(console.error);
