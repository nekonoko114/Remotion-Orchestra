import fs from 'fs';
import path from 'path';
import https from 'https';
import { chromium } from 'playwright';

const downloadImage = (url: string, filepath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 200) {
          res
            .pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve());
        } else if (res.statusCode === 301 || res.statusCode === 302) {
          // Handle redirects if necessary, though direct avatar links usually don't
          if (res.headers.location) {
            downloadImage(res.headers.location, filepath)
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error(`Redirect without location header`));
          }
        } else {
          res.resume();
          reject(
            new Error(`Request Failed With Status Code: ${res.statusCode}`),
          );
        }
      })
      .on('error', reject);
  });
};

const getTikTokProfileWithPlaywright = async (
  browser: any,
  username: string,
) => {
  const url = `https://www.tiktok.com/@${username}`;
  const avatarDir = path.join(process.cwd(), 'public/assets/avatars');

  if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
  }

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    console.log(`  Navigating to ${url}...`);
    // Wait until load to bypass initial WAF checks
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait a bit for React to hydrate and any anti-bot JS to run
    await page.waitForTimeout(2000);

    // Try to extract the JSON directly from the page content like before, but rendered by browser
    const html = await page.content();
    const match = html.match(
      /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"([^>]*)>([^<]+)<\/script>/,
    );

    let nickname = 'Not Found';
    let avatarUrl = '';

    if (match && match[2]) {
      try {
        const data = JSON.parse(match[2]);
        const userModule =
          data?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user;
        if (userModule) {
          nickname = userModule.nickname;
          avatarUrl =
            userModule.avatarLarger ||
            userModule.avatarMedium ||
            userModule.avatarThumb;
        }
      } catch (e) {
        console.error(`  Failed to parse JSON for ${username}`);
      }
    }

    // Fallback: extract from DOM if JSON parsing failed
    if (!avatarUrl) {
      console.log(`  Trying DOM extraction for ${username}...`);
      // Attempt to find image by typical class names or alt text containing username
      const imgLocator = page.locator(
        'img[alt*="profile"], img[src*="tiktokcdn"]',
      );

      if ((await imgLocator.count()) > 0) {
        const firstImgSrc = await imgLocator.first().getAttribute('src');
        if (firstImgSrc && !firstImgSrc.includes('data:image')) {
          avatarUrl = firstImgSrc;
        }
      }

      // Attempt to find nickname
      const h1Locator = page.locator('h1[data-e2e="user-title"]');
      if ((await h1Locator.count()) > 0) {
        const text = await h1Locator.first().textContent();
        if (text) nickname = text.trim();
      }
    }

    await context.close();

    if (avatarUrl) {
      const localFilename = `${username}.jpg`;
      const localPath = path.join(avatarDir, localFilename);
      const publicPath = `/assets/avatars/${localFilename}`;

      try {
        console.log(`  Downloading avatar for ${username}...`);
        await downloadImage(avatarUrl, localPath);
        return {
          id: username,
          nickname: nickname,
          avatar: avatarUrl,
          localAvatar: publicPath,
        };
      } catch (downloadErr) {
        console.error(
          `  Failed to download avatar for ${username}:`,
          downloadErr,
        );
        return {
          id: username,
          nickname: nickname,
          avatar: avatarUrl,
          localAvatar: '',
        };
      }
    }

    return {
      id: username,
      nickname: nickname || 'No Avatar Found',
      avatar: '',
      localAvatar: '',
    };
  } catch (err: any) {
    console.error(`  Error processing ${username}:`, err.message);
    await context.close();
    return {
      id: username,
      nickname: 'Browser Error',
      avatar: '',
      localAvatar: '',
    };
  }
};

const main = async () => {
  const text = fs.readFileSync('jol-liver.txt', 'utf8');
  const ids = text
    .split('\n')
    .map((id) => id.trim())
    .filter((id) => id);
  const results = [];

  console.log(
    `Starting to fetch data for ${ids.length} users using Playwright...`,
  );

  const browser = await chromium.launch({ headless: true });

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    console.log(`[${i + 1}/${ids.length}] Processing ${id}...`);
    const data = await getTikTokProfileWithPlaywright(browser, id);
    results.push(data);
    // Wait between requests to be safe
    await new Promise((r) => setTimeout(r, 1000));
  }

  await browser.close();

  fs.writeFileSync('jol-liver.json', JSON.stringify(results, null, 2));
  console.log('Successfully saved data to jol-liver.json');
};

main();
