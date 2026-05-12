const TONES = [
  {
    id: 'TONE_1_DEEP_NAVY_GOLD',
    label: 'Deep Navy & Gold',
    summary: '깊은 군청 밤하늘, 얇은 금빛 수평선, 미니멀',
    basePrompt: "Cinematic YouTube thumbnail background, deep navy night sky with faint distant stars, a single subtle thin gold horizontal line dividing the composition, vast negative space, painterly soft texture, mood: quiet midnight reflection, no text, no faces, no logos, minimalist Korean ambient aesthetic",
    paletteHint: { primary: '#0B2A4A', accent: '#D4A050' }
  },
  {
    id: 'TONE_2_INK_WASH',
    label: 'Ink Wash (수묵)',
    summary: '한지 위 수묵화, 흐릿한 산수, 비 내리는 정적',
    basePrompt: "Cinematic YouTube thumbnail background, traditional Korean ink wash sumi-e painting style, soft brush strokes suggesting distant mountain in rain, vast white hanji paper background, ink bleed texture, mood: contemplative silence, no text, only ink essence, off-center composition with deep negative space",
    paletteHint: { primary: '#F4F1EA', accent: '#2A2A2A' }
  },
  {
    id: 'TONE_3_SEPIA_DIARY',
    label: 'Sepia Diary',
    summary: '세피아 일기장, 커피 자국, 만년필 흔적',
    basePrompt: "Cinematic YouTube thumbnail background, warm sepia and aged paper tones, subtle paper grain, faint coffee ring stain and pressed flower in corner, soft fountain pen ink trace, mood: nostalgic late afternoon journaling, no text, no people, vintage warmth, film grain",
    paletteHint: { primary: '#C8945A', accent: '#5A3A1F' }
  },
  {
    id: 'TONE_4_COOL_MIDNIGHT',
    label: 'Cool Midnight',
    summary: '도심 한밤 단색 블루, 먼 가로등 한 점',
    basePrompt: "Cinematic YouTube thumbnail background, monochrome midnight blue gradient sky, single distant glowing window or lone streetlight as focal point in far distance, vast dark composition, mood: lonely city night, hyper-minimal, no text, no foreground objects, cinematic stillness",
    paletteHint: { primary: '#0A1828', accent: '#E8C470' }
  },
  {
    id: 'TONE_5_DAWN_MIST',
    label: 'Dawn Mist',
    summary: '새벽 안개, 라벤더→그레이블루, 자전거 실루엣',
    basePrompt: "Cinematic YouTube thumbnail background, soft dawn fog gradient from pale lavender to misty gray-blue, faint silhouette of a single bicycle far in distance, mood: 4am quiet awakening, soft diffused light, vast atmospheric space, no sharp details, no text",
    paletteHint: { primary: '#C0B0C8', accent: '#6A7888' }
  }
];

module.exports = { TONES };
