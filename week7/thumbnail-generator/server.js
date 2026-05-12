require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;

const TONES = {
  TONE_1_DEEP_NAVY_GOLD: {
    name: 'Deep Navy & Gold',
    summary: '깊은 군청 밤하늘, 얇은 금빛 수평선, 미니멀',
    prompt: "Cinematic YouTube thumbnail background, deep navy night sky with faint distant stars, a single subtle thin gold horizontal line dividing the composition, vast negative space, painterly soft texture, mood: quiet midnight reflection, no text, no faces, no logos, minimalist Korean ambient aesthetic"
  },
  TONE_2_INK_WASH: {
    name: 'Ink Wash (수묵)',
    summary: '한지 위 수묵화, 흐릿한 산수, 비 내리는 정적',
    prompt: "Cinematic YouTube thumbnail background, traditional Korean ink wash sumi-e painting style, soft brush strokes suggesting distant mountain in rain, vast white hanji paper background, ink bleed texture, mood: contemplative silence, no text, only ink essence, off-center composition with deep negative space"
  },
  TONE_3_SEPIA_DIARY: {
    name: 'Sepia Diary',
    summary: '세피아 일기장, 커피 자국, 만년필 흔적',
    prompt: "Cinematic YouTube thumbnail background, warm sepia and aged paper tones, subtle paper grain, faint coffee ring stain and pressed flower in corner, soft fountain pen ink trace, mood: nostalgic late afternoon journaling, no text, no people, vintage warmth, film grain"
  },
  TONE_4_COOL_MIDNIGHT: {
    name: 'Cool Midnight',
    summary: '도심 한밤 단색 블루, 먼 가로등 한 점',
    prompt: "Cinematic YouTube thumbnail background, monochrome midnight blue gradient sky, single distant glowing window or lone streetlight as focal point in far distance, vast dark composition, mood: lonely city night, hyper-minimal, no text, no foreground objects, cinematic stillness"
  },
  TONE_5_DAWN_MIST: {
    name: 'Dawn Mist',
    summary: '새벽 안개, 라벤더→그레이블루, 자전거 실루엣',
    prompt: "Cinematic YouTube thumbnail background, soft dawn fog gradient from pale lavender to misty gray-blue, faint silhouette of a single bicycle far in distance, mood: 4am quiet awakening, soft diffused light, vast atmospheric space, no sharp details, no text"
  }
};

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname)));

app.get('/api/tones', (req, res) => {
  const list = Object.entries(TONES).map(([key, v]) => ({ key, name: v.name, summary: v.summary }));
  res.json(list);
});

app.get('/api/results', (req, res) => {
  const dir = path.join(__dirname, 'generated');
  if (!fs.existsSync(dir)) return res.json([]);
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^(TONE_\d+_[A-Z_]+)_(\d+)x(\d+)\.png$/);
    if (!m) continue;
    const [, tone, w, h] = m;
    out.push({ tone, orientation: +w > +h ? 'landscape' : 'portrait', size: `${w}x${h}`, url: `/generated/${f}` });
  }
  res.json(out);
});

app.post('/api/generate', async (req, res) => {
  const { tone, orientation } = req.body;
  const def = TONES[tone];
  if (!def) return res.status(400).json({ error: 'unknown tone' });
  if (!['landscape', 'portrait'].includes(orientation)) return res.status(400).json({ error: 'orientation must be landscape|portrait' });

  const size = orientation === 'landscape' ? '1536x1024' : '1024x1536';
  try {
    const t0 = Date.now();
    const out = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: def.prompt,
      size,
      quality: 'medium',
      n: 1
    });
    const rawBuf = Buffer.from(out.data[0].b64_json, 'base64');

    const final = orientation === 'landscape'
      ? await sharp(rawBuf).extract({ left: 0, top: 80, width: 1536, height: 864 }).resize(1920, 1080).png().toBuffer()
      : await sharp(rawBuf).extract({ left: 80, top: 0, width: 864, height: 1536 }).resize(1080, 1920).png().toBuffer();

    res.json({
      tone,
      orientation,
      size: orientation === 'landscape' ? '1920x1080' : '1080x1920',
      ms: Date.now() - t0,
      b64: final.toString('base64')
    });
  } catch (err) {
    console.error('[generate]', tone, orientation, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`thumbnail-generator on http://localhost:${PORT}`);
});
