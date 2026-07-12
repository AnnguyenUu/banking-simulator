import { chromium } from 'playwright';

const shotsDir = '/private/tmp/claude-501/-Users-annguyenuu-Documents-baking/38893b0f-1ecb-4d8d-97ea-9c29ff12d019/scratchpad/shots';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
});

await page.goto('http://localhost:5173/login');
await page.waitForTimeout(1000);
await page.screenshot({ path: `${shotsDir}/00-login.png` });

await page.fill('input[type="email"], input[placeholder="you@example.com"]', 'jordan.lee@example.com');
await page.fill('input[type="password"]', 'password123');
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);
await page.screenshot({ path: `${shotsDir}/01-overview.png`, fullPage: true });

const routes = ['/transactions', '/transfer', '/insights'];
for (const route of routes) {
  await page.goto(`http://localhost:5173${route}`);
  await page.waitForTimeout(1500);
  const name = route.replace('/', '');
  await page.screenshot({ path: `${shotsDir}/02-${name}.png`, fullPage: true });
}

await browser.close();
console.log('done');
