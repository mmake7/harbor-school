require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const { PDFDocument } = require('pdf-lib');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const ASSETS = path.join(ROOT, 'assets');
const OUTPUT = path.join(ROOT, 'output');

const VCARD = `BEGIN:VCARD
VERSION:3.0
N:박;인수;;;
FN:박인수
ORG:DAONi (다온이)
TITLE:Founder & CEO
TEL;TYPE=CELL:+82-10-2649-4695
EMAIL:makehill@naver.com
NOTE:KakaoTalk\\: maketour
END:VCARD`;

app.use(express.json());
app.use(express.static(ROOT));

app.get('/api/qr.svg', async (req, res) => {
  const svg = await QRCode.toString(VCARD, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, color: { dark: '#1A1A1A', light: '#00000000' } });
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

const ASSET_PROMPTS = {
  'hanji-bg.png': {
    prompt: "Traditional Korean hanji paper texture background, off-white #F5F1E8 base tone, subtle ivory and warm cream variation, natural plant fiber inclusions visible, soft organic grain, no patterns, no text, no objects, flat surface viewed straight from above, soft diffused natural light, photographic realism, square composition",
    size: '1024x1024'
  },
  'ink-stroke.png': {
    prompt: "Single traditional Korean sumi-e ink brush stroke isolated on pure white background, one expressive bamboo leaf or minimal calligraphic gesture, deep black ink only, varying ink density from saturated to dry brush, organic and gestural, no other elements, no text, white empty background suitable for clean keying, centered composition, square frame",
    size: '1024x1024'
  },
  'bee-honeycomb-lineart.png': {
    prompt: "Minimalist line art illustration: two honeybees in flight near a small hexagonal honeycomb cluster, ultra thin clean black ink lines only, no shading, no fill, no color, no gradient, no shadows, botanical scientific illustration style, elegant single-weight line drawing, pure white background, isolated subject, asymmetric composition with negative space on the right side, square frame, suitable as an elegant card background graphic",
    size: '1024x1024'
  },
  'hanji-bee-tech-bg.png': {
    prompt: "Korean traditional hanji cream paper background as base texture, with very faint barely visible honeybee silhouettes AND ultra-thin hexagonal grid lines with small network nodes scattered subtly across the entire surface, watermark-like extreme low opacity (5-10%), abstract minimal line art combining honeybees (nature, BeeAI) and hexagonal grid with connection nodes (tech, AI), uniform sparse distribution across the whole image, no faces, no text, no logos, warm cream tone #F5F1E8, suitable for premium business card background printing, 3:2 horizontal card ratio composition, two motifs gently coexist as a unified watermark layer",
    size: '1536x1024'
  },
  'hanji-bee-tech-bg-thin.png': {
    prompt: "Ultra-thin minimal continuous line drawing of honeybees and hexagonal honeycomb pattern, single-stroke vector style, barely visible watermark, delicate hairline weight, scattered across cream hanji paper background, extremely subtle, almost imperceptible, contemporary tech minimal aesthetic, no fills, no shadows, no text, no logos, monochrome ink lines on warm cream tone #F5F1E8, two bees and a small hexagonal grid cluster coexist gently, 3:2 horizontal business card background ratio, premium minimal design",
    size: '1536x1024'
  },
  'hanji-bee-tech-bg-ghibli.png': {
    prompt: "Ultra-thin minimal hand-drawn line illustration of cute friendly honeybees and a small hexagonal honeycomb cluster, Studio Ghibli inspired whimsical anime aesthetic, round soft warm character forms, gentle charming bees with simple expressive minimal anatomy but no detailed faces, hand-drawn fine pen quality, single-stroke continuous line style, delicate hairline weight throughout, scattered subtly across warm cream hanji paper background tone #F5F1E8, watermark-like extreme low presence, no fills, no shadows, no color, no text, no logos, monochrome black ink lines only, storybook-like friendly minimal design, premium business card background, 3:2 horizontal composition with negative space",
    size: '1536x1024'
  },
  'hanji-bee-tech-bg-minimal.png': {
    prompt: "Extremely minimal watermark-style background for premium business card. Cream hanji paper texture. ONE single large hexagonal honeycomb shape on the right-center, composed of 3-4 connected hexagons in an organic flower-like cluster (not a regular grid), drawn with ultra-thin hairline weight. ONE tiny bee silhouette in upper-right corner, hairline outline only, no fills. Opacity should appear 8-10% (barely visible watermark). Generous empty space. No text. Suitable for 90x54mm horizontal business card. Contemporary minimal aesthetic. Pale warm cream tone background. Left half of the image MUST be completely empty (negative space).",
    size: '1536x1024'
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

// 96mm × 60mm @ 96dpi = 363 × 227 CSS px. deviceScaleFactor 3.125 → 1134×709 output (300dpi).
async function renderSide(browser, side) {
  const page = await browser.newPage();
  await page.setViewport({ width: 363, height: 227, deviceScaleFactor: 3.125 });
  await page.goto(`http://localhost:${PORT}/?side=${side}&print=1`, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 363, height: 227 }, omitBackground: false });
  await page.close();
  return buf;
}

async function renderPdf(browser) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/?print=1`, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  const buf = await page.pdf({ width: '96mm', height: '60mm', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.close();
  return buf;
}

app.post('/api/render', async (req, res) => {
  if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  try {
    const t0 = Date.now();
    const [front, back] = await Promise.all([renderSide(browser, 'front'), renderSide(browser, 'back')]);
    fs.writeFileSync(path.join(OUTPUT, 'front.png'), front);
    fs.writeFileSync(path.join(OUTPUT, 'back.png'), back);
    const pdf = await renderPdf(browser);
    fs.writeFileSync(path.join(OUTPUT, 'business-card.pdf'), pdf);
    res.json({ ms: Date.now() - t0, output: ['front.png', 'back.png', 'business-card.pdf'].map(f => `/output/${f}`) });
  } catch (err) {
    console.error('[render]', err);
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`business-card on http://localhost:${PORT}`);
});
