require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

const { TONES } = require('./shared/tones');
const { VISUAL_TYPES, getVisualType } = require('./shared/visualTypes');
const { generateForVisualType } = require('./shared/imageGenerator');
const { fileName, scanGenerated } = require('./shared/results');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const PORT = process.env.PORT || 3000;
const GENERATED_DIR = path.join(__dirname, 'generated');

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname)));

app.get('/api/tones', (req, res) => {
  res.json(TONES.map(t => ({ id: t.id, label: t.label, summary: t.summary, paletteHint: t.paletteHint })));
});

app.get('/api/visual-types', (req, res) => {
  res.json(VISUAL_TYPES.map(v => ({ id: v.id, label: v.label, summary: v.summary, compositionHint: v.compositionHint, outputs: v.outputs.map(o => ({ name: o.name, finalSize: o.finalSize })) })));
});

app.get('/api/results', (req, res) => {
  res.json(scanGenerated(GENERATED_DIR));
});

app.post('/api/generate', async (req, res) => {
  const { toneId, visualTypeId } = req.body;
  const tone = TONES.find(t => t.id === toneId);
  const visualType = getVisualType(visualTypeId);
  if (!tone) return res.status(400).json({ error: 'unknown toneId' });
  if (!visualType) return res.status(400).json({ error: 'unknown visualTypeId' });

  try {
    if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });
    const t0 = Date.now();
    const results = await generateForVisualType(openai, tone, visualType);

    for (let i = 0; i < results.length; i++) {
      const out = visualType.outputs[i];
      const fp = path.join(GENERATED_DIR, fileName(tone.id, visualType.id, out));
      fs.writeFileSync(fp, Buffer.from(results[i].b64, 'base64'));
    }

    res.json({
      toneId,
      visualTypeId,
      ms: Date.now() - t0,
      outputs: results.map((r, i) => ({
        name: r.name,
        finalSize: r.finalSize,
        ms: r.ms,
        url: `/generated/${fileName(tone.id, visualType.id, visualType.outputs[i])}`
      }))
    });
  } catch (err) {
    console.error('[generate]', toneId, visualTypeId, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`static-visual-maker on http://localhost:${PORT}`);
});
