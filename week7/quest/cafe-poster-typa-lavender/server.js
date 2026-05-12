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
  'main-visual.png': {
    prompt: "Japanese anime illustration of a tall clear glass filled with baby lavender cream soda, white cream foam top, drawn in 90s magical girl anime aesthetic (Sailor Moon / Cardcaptor Sakura style), cel-shaded with thick black outlines and flat pastel colors, baby lavender #D4C5E3 dominant color, small white angel wings spreading from either side of the glass, sparkles and stars rising from the cream, surrounded by hand-drawn crayon-style doodles in white and baby lavender: tiny stars, hearts, sparkles, small clouds, tiny wings, childlike scribbles, kawaii Y2K aesthetic, dark black #0A0A0A background with subtle lavender glow halo behind the glass, magical and dreamy atmosphere, vertical 2:3 composition, central glass takes 50%+ of frame, ABSOLUTELY no text, no letters, no numbers, no words anywhere in the image",
    size: '1024x1536'
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

    const pngPage = await browser.newPage();
    await pngPage.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });
    await pngPage.goto(`http://localhost:${PORT}/?print=1`, { waitUntil: 'networkidle0' });
    await pngPage.emulateMediaType('print');
    const pngBuf = await pngPage.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 }, omitBackground: false });
    fs.writeFileSync(path.join(OUTPUT, 'poster.png'), pngBuf);
    await pngPage.close();

    const pdfPage = await browser.newPage();
    await pdfPage.goto(`http://localhost:${PORT}/?print=1`, { waitUntil: 'networkidle0' });
    await pdfPage.emulateMediaType('print');
    const pdfBuf = await pdfPage.pdf({ width: '96mm', height: '120mm', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    fs.writeFileSync(path.join(OUTPUT, 'poster.pdf'), pdfBuf);
    await pdfPage.close();

    res.json({ ms: Date.now() - t0, output: ['poster.png', 'poster.pdf'].map(f => `/output/${f}`) });
  } catch (err) {
    console.error('[render]', err);
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`cafe-poster-typa-lavender on http://localhost:${PORT}`);
});
