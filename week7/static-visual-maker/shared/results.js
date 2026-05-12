const fs = require('fs');
const path = require('path');

// File name rule: {TONE_ID}__{VISUAL_TYPE_ID}__{OUTPUT_NAME}_{WIDTH}x{HEIGHT}.png
const FILE_RE = /^(TONE_\d+_[A-Z_]+)__([a-z0-9-]+)__([a-z0-9-]+)_(\d+)x(\d+)\.png$/;

function fileName(toneId, visualTypeId, output) {
  return `${toneId}__${visualTypeId}__${output.name}_${output.finalSize}.png`;
}

function scanGenerated(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(FILE_RE);
    if (!m) continue;
    out.push({
      toneId: m[1],
      visualTypeId: m[2],
      outputName: m[3],
      finalSize: `${m[4]}x${m[5]}`,
      url: `/generated/${f}`
    });
  }
  return out;
}

module.exports = { fileName, scanGenerated };
