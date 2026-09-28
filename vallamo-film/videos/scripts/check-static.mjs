import { chromium } from "playwright";
import path from "node:path";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1400 } });
await p.route(/^https?:/, (r) => r.abort());
for (const n of process.argv.slice(2)) {
  await p.goto("file://" + path.resolve(`public/ui/snaps/${n}.html`)); await p.waitForTimeout(300);
  await p.screenshot({ path: `out/snaps/${n}.static.png` });
}
await b.close();
