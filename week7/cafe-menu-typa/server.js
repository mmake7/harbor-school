require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const ASSETS = path.join(ROOT, 'assets');
const OUTPUT = path.join(ROOT, 'output');

app.use(express.json());
app.use(express.static(ROOT));

const ASSET_PROMPTS = {
  'bg-dark-pink.png': {
    prompt: "Ultra dark elegant Y2K gothic background, deep black gradient with subtle baby pink #F4C2D7 soft glow accents in corners, very faint scattered small cross † symbols and tiny angel wing silhouettes as watermark pattern across the entire image with opacity 5-8% (barely visible), no text, no objects in center, atmospheric and dreamy moody, suitable for cafe menu poster background, contemporary lovely-gothic aesthetic, 4:5 vertical composition, dark background with pink glow",
    size: '1024x1536'
  },
  'soda-illustration.png': {
    prompt: "Minimal line art illustration of a tall slim drinking glass filled with creamy baby pink soda topped with cream foam and a cherry, two small delicate angel wings on either side of the glass at the top, hairline weight black outline only on a pure white background, baby pink #F4C2D7 soft fill only inside the glass area, contemporary minimal lovely-gothic illustration style, no text, no other elements, centered composition, square frame, suitable for menu accent illustration",
    size: '1024x1024'
  }
};

app.post('/api/assets/generate', async (req, res) => {
  if (!fs.existsSync(ASSETS)) fs.mkdirSync(ASSETS, { recursive: true });
  const out = {};
  for (const [name, spec] of Object.entries(ASSET_PROMPTS)) {
    const fp = path.join(ASSETS, name);
    if (fs.existsSync(fp) && !req.body?.force) {
      out[name] = { skipped: true, path: `/assets/${name}` };
      continue;
    }
    const t0 = Date.now();
    const r = await openai.images.generate({ model: 'gpt-image-1', prompt: spec.prompt, size: spec.size, quality: 'medium', n: 1 });
    fs.writeFileSync(fp, Buffer.from(r.data[0].b64_json, 'base64'));
    out[name] = { ms: Date.now() - t0, path: `/assets/${name}` };
  }
  res.json(out);
});

app.post('/api/render', async (req, res) => {
  if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  try {
    const t0 = Date.now();

    // PNG: 1080x1350 CSS px × deviceScaleFactor 2 = 2160x2700 output
    const pngPage = await browser.newPage();
    await pngPage.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
    await pngPage.goto(`http://localhost:${PORT}/?print=1`, { waitUntil: 'networkidle0' });
    await pngPage.emulateMediaType('print');
    const pngBuf = await pngPage.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 }, omitBackground: false });
    fs.writeFileSync(path.join(OUTPUT, 'menu.png'), pngBuf);
    await pngPage.close();

    // PDF: 96mm x 120mm (4:5)
    const pdfPage = await browser.newPage();
    await pdfPage.goto(`http://localhost:${PORT}/?print=1`, { waitUntil: 'networkidle0' });
    await pdfPage.emulateMediaType('print');
    const pdfBuf = await pdfPage.pdf({ width: '96mm', height: '120mm', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    fs.writeFileSync(path.join(OUTPUT, 'menu.pdf'), pdfBuf);
    await pdfPage.close();

    res.json({ ms: Date.now() - t0, output: ['menu.png', 'menu.pdf'].map(f => `/output/${f}`) });
  } catch (err) {
    console.error('[render]', err);
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`cafe-menu-typa on http://localhost:${PORT}`);
});
