const sharp = require('sharp');

async function generateOne(openai, tone, visualType, output) {
  const t0 = Date.now();
  const res = await openai.images.generate({
    model: 'gpt-image-1',
    prompt: tone.basePrompt + visualType.additionalPrompt,
    size: output.modelSize,
    quality: 'medium',
    n: 1
  });
  const rawBuf = Buffer.from(res.data[0].b64_json, 'base64');

  const [w, h] = output.finalSize.split('x').map(Number);
  let pipeline = sharp(rawBuf);
  if (output.crop) pipeline = pipeline.extract(output.crop);
  const final = await pipeline.resize(w, h).png().toBuffer();

  return {
    name: output.name,
    finalSize: output.finalSize,
    ms: Date.now() - t0,
    b64: final.toString('base64')
  };
}

async function generateForVisualType(openai, tone, visualType) {
  return Promise.all(visualType.outputs.map(o => generateOne(openai, tone, visualType, o)));
}

module.exports = { generateOne, generateForVisualType };
