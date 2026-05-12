const VISUAL_TYPES = [
  {
    id: 'youtube-thumbnail',
    label: 'YouTube 썸네일',
    summary: '가로 1920×1080 + 세로 1080×1920 (2장)',
    compositionHint: '가로·세로 두 방향 동시 생성. 텍스트 합성 없음.',
    additionalPrompt: '',
    outputs: [
      { name: 'landscape', finalSize: '1920x1080', modelSize: '1536x1024', crop: { left: 0, top: 80, width: 1536, height: 864 } },
      { name: 'portrait', finalSize: '1080x1920', modelSize: '1024x1536', crop: { left: 80, top: 0, width: 864, height: 1536 } }
    ]
  },
  {
    id: 'instagram-card',
    label: 'Instagram 광고 카드',
    summary: '정사각 1080×1080 (1장)',
    compositionHint: '캡션·CTA 얹을 사방 여백 + 중앙 포커스.',
    additionalPrompt: ', centered focal point with balanced breathing room on all four sides, square 1080x1080 Instagram feed composition',
    outputs: [
      { name: 'square', finalSize: '1080x1080', modelSize: '1024x1024', crop: null }
    ]
  },
  {
    id: 'profile-card',
    label: '프로필 카드 (OG / 블로그 / LinkedIn)',
    summary: '가로 1200×630 (1장)',
    compositionHint: '좌측 비주얼 + 우측 텍스트 오버레이 자리. 무드·텍스처·컬러 우선.',
    additionalPrompt: ', compositional weight on the left side, leaving right side as breathing space for name and role text overlay, prioritize mood, texture, and color over literal objects; any objects should appear as faint, abstracted suggestions, 1200x630 horizontal profile card background composition',
    outputs: [
      { name: 'landscape', finalSize: '1200x630', modelSize: '1536x1024', crop: { left: 0, top: 109, width: 1536, height: 806 } }
    ]
  }
];

function getVisualType(id) {
  return VISUAL_TYPES.find(v => v.id === id);
}

module.exports = { VISUAL_TYPES, getVisualType };
