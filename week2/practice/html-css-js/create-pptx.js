const PptxGenJS = require('pptxgenjs');
const pres = new PptxGenJS();

// ===== 디자인 토큰 =====
const C = {
  NAVY: '113186', NAVY_DARK: '053259', NAVY_DEEP: '0A40A2',
  BLUE: '0083FF', BLUE_ALT: '0085CD', BLUE_LIGHT: '499ED8',
  BLUE_SKY: '5B9BD5', BLUE_BRIGHT: '4BACFF',
  YELLOW: 'FFFF00', RED: 'D00F37',
  BLACK: '1F1F1F', DARK_GRAY: '50525F', MID_GRAY: '7E8CAA',
  LIGHT_BG: 'EBF0F9', WHITE: 'FFFFFF',
  TBL_HEADER: '113186', TBL_ROW_ALT: 'EBF0F9',
};

const F = {
  TITLE_XL: '페이퍼로지 8 ExtraBold',
  TITLE: '페이퍼로지 7 Bold',
  SUBTITLE: '페이퍼로지 6 SemiBold',
  BODY: '페이퍼로지 5 Medium',
  BODY_LIGHT: '페이퍼로지 4 Regular',
  EN: 'Arial',
};

pres.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
pres.layout = 'WIDE';

// ===== 공통 함수 =====
function addHeader(slide, chapterLabel) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 0.55,
    fill: { color: C.NAVY_DARK }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 1.6, h: 0.55,
    fill: { color: C.NAVY }
  });
  slide.addText(chapterLabel, {
    x: 0.1, y: 0.05, w: 1.4, h: 0.45,
    fontSize: 10, fontFace: F.BODY, color: C.WHITE,
    valign: 'middle', margin: 0
  });
  slide.addText('HTML 기본 태그 학습', {
    x: 5, y: 0.05, w: 6.5, h: 0.45,
    fontSize: 9, fontFace: F.BODY_LIGHT, color: 'CCCCCC',
    align: 'right', valign: 'middle', margin: 0
  });
}

function addSlideTitle(slide, title, subSlogan) {
  slide.addShape(pres.shapes.OVAL, {
    x: 0.4, y: 1.0, w: 0.18, h: 0.18,
    fill: { color: C.BLUE }
  });
  slide.addText(title, {
    x: 0.7, y: 0.85, w: 12, h: 0.55,
    fontSize: 24, fontFace: F.TITLE, color: C.BLACK, margin: 0
  });
  if (subSlogan) {
    slide.addText(`"${subSlogan}"`, {
      x: 0.9, y: 1.4, w: 11.5, h: 0.4,
      fontSize: 14, fontFace: F.BODY, color: C.NAVY_DEEP, margin: 0
    });
  }
}

function addSectionTitle(slide, title, desc, x, y) {
  slide.addShape(pres.shapes.OVAL, {
    x: x, y: y + 0.05, w: 0.22, h: 0.22,
    fill: { color: C.BLUE }
  });
  slide.addText('▶', {
    x: x + 0.02, y: y + 0.03, w: 0.18, h: 0.22,
    fontSize: 8, color: C.WHITE, align: 'center', valign: 'middle', margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x + 0.3, y: y, w: title.length * 0.18 + 0.4, h: 0.32,
    fill: { color: C.YELLOW }
  });
  slide.addText(title, {
    x: x + 0.4, y: y, w: title.length * 0.18 + 0.2, h: 0.32,
    fontSize: 15, fontFace: F.SUBTITLE, color: C.BLACK, valign: 'middle', margin: 0
  });
  if (desc) {
    slide.addText(desc, {
      x: x + 0.4, y: y + 0.38, w: 10, h: 0.28,
      fontSize: 11, fontFace: F.BODY, color: C.DARK_GRAY, margin: 0
    });
  }
}

function addPageNum(slide, num) {
  slide.addText(`- ${num} -`, {
    x: 5.5, y: 7.1, w: 2, h: 0.3,
    fontSize: 10, fontFace: F.EN, color: C.MID_GRAY,
    align: 'center', margin: 0
  });
}

function addCodeBox(slide, code, x, y, w, h) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: '1E293B' },
    rectRadius: 0.1
  });
  slide.addText(code, {
    x: x + 0.2, y: y + 0.15, w: w - 0.4, h: h - 0.3,
    fontSize: 13, fontFace: 'Consolas', color: 'E2E8F0',
    valign: 'top', margin: 0
  });
}

// ========================================
// 슬라이드 1: 표지
// ========================================
const cover = pres.addSlide();
cover.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.33, h: 4.875,
  fill: { color: C.NAVY_DARK }
});
cover.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 4.875, w: 13.33, h: 2.625,
  fill: { color: 'F5F5F5' }
});
cover.addText('HTML 기본 태그 5가지', {
  x: 1.5, y: 2.0, w: 10, h: 1.5,
  fontSize: 44, fontFace: F.TITLE_XL, color: C.WHITE, margin: 0
});
cover.addShape(pres.shapes.LINE, {
  x: 1.5, y: 3.5, w: 7.5, h: 0,
  line: { color: C.WHITE, width: 1 }
});
cover.addText('웹 페이지의 기본 구조를 만드는 핵심 태그', {
  x: 1.5, y: 3.7, w: 10, h: 0.5,
  fontSize: 16, fontFace: F.BODY, color: C.BLUE_BRIGHT, margin: 0
});
cover.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 1.5, y: 5.2, w: 1.8, h: 0.35,
  fill: { color: C.RED }, rectRadius: 0.05
});
cover.addText('2주차 학습', {
  x: 1.5, y: 5.2, w: 1.8, h: 0.35,
  fontSize: 10, fontFace: F.BODY, color: C.WHITE,
  align: 'center', valign: 'middle', margin: 0
});
cover.addText('2026년 3월', {
  x: 3.5, y: 5.2, w: 2, h: 0.35,
  fontSize: 12, fontFace: F.BODY, color: C.DARK_GRAY, margin: 0
});

// ========================================
// 슬라이드 2: 목차
// ========================================
const toc = pres.addSlide();
toc.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 5.33, h: 7.5,
  fill: { color: C.NAVY_DARK }
});
toc.addText('HTML', {
  x: 0.5, y: 1.2, w: 4, h: 0.5,
  fontSize: 18, fontFace: F.TITLE, color: C.WHITE, margin: 0
});
toc.addText('CONTENTS', {
  x: 0.5, y: 1.8, w: 4, h: 0.8,
  fontSize: 32, fontFace: F.TITLE_XL, color: C.WHITE, margin: 0
});

const tocItems = [
  { num: '01', tag: '<h1>', kr: '제목 태그' },
  { num: '02', tag: '<p>', kr: '문단 태그' },
  { num: '03', tag: '<a>', kr: '링크 태그' },
  { num: '04', tag: '<img>', kr: '이미지 태그' },
  { num: '05', tag: '<ul> / <li>', kr: '목록 태그' },
];

tocItems.forEach((item, i) => {
  const y = 0.8 + i * 1.2;
  toc.addText(item.num, {
    x: 6.0, y, w: 0.6, h: 0.9,
    fontSize: 28, fontFace: F.TITLE_XL, color: C.NAVY,
    valign: 'middle', margin: 0
  });
  toc.addShape(pres.shapes.LINE, {
    x: 6.0, y: y + 0.85, w: 0.5, h: 0,
    line: { color: C.NAVY, width: 2 }
  });
  toc.addText(item.tag, {
    x: 6.8, y: y + 0.05, w: 6, h: 0.3,
    fontSize: 11, fontFace: 'Consolas', color: C.MID_GRAY, margin: 0
  });
  toc.addText(item.kr, {
    x: 6.8, y: y + 0.3, w: 6, h: 0.55,
    fontSize: 22, fontFace: F.TITLE, color: C.BLACK, margin: 0
  });
});

// ========================================
// 슬라이드 3: <h1> 제목 태그
// ========================================
const s3 = pres.addSlide();
s3.background = { color: C.WHITE };
addHeader(s3, 'TAG 01');
addSlideTitle(s3, '<h1> ~ <h6> 제목 태그', '페이지의 제목과 구조를 정의하는 핵심 태그');

addSectionTitle(s3, '사용법', '제목의 중요도에 따라 h1(가장 큰) ~ h6(가장 작은)을 사용합니다.', 0.5, 2.0);

addCodeBox(s3,
  '<h1>가장 큰 제목</h1>\n<h2>두 번째 제목</h2>\n<h3>세 번째 제목</h3>',
  0.5, 2.8, 5.5, 2.2
);

// 우측: 결과 미리보기
s3.addShape(pres.shapes.RECTANGLE, {
  x: 6.5, y: 2.8, w: 6.3, h: 2.2,
  fill: { color: C.LIGHT_BG },
  line: { color: 'E0E0E0', width: 1 },
  rectRadius: 0.1
});
s3.addText('▶ 결과', {
  x: 6.7, y: 2.9, w: 2, h: 0.3,
  fontSize: 10, fontFace: F.SUBTITLE, color: C.MID_GRAY, margin: 0
});
s3.addText('가장 큰 제목', {
  x: 6.7, y: 3.3, w: 5.8, h: 0.5,
  fontSize: 24, fontFace: F.TITLE_XL, color: C.BLACK, bold: true, margin: 0
});
s3.addText('두 번째 제목', {
  x: 6.7, y: 3.8, w: 5.8, h: 0.4,
  fontSize: 18, fontFace: F.TITLE, color: C.BLACK, bold: true, margin: 0
});
s3.addText('세 번째 제목', {
  x: 6.7, y: 4.2, w: 5.8, h: 0.35,
  fontSize: 14, fontFace: F.SUBTITLE, color: C.BLACK, bold: true, margin: 0
});

// 포인트
s3.addText([
  { text: '✔ ', options: { color: C.BLUE, bold: true } },
  { text: 'h1은 페이지당 하나만 사용하는 것이 SEO에 유리합니다.', options: { color: C.BLACK } }
], {
  x: 0.5, y: 5.5, w: 12, h: 0.4,
  fontSize: 13, fontFace: F.BODY, margin: 0
});
s3.addText([
  { text: '✔ ', options: { color: C.BLUE, bold: true } },
  { text: '검색엔진이 제목 태그를 통해 페이지 구조를 파악합니다.', options: { color: C.BLACK } }
], {
  x: 0.5, y: 5.95, w: 12, h: 0.4,
  fontSize: 13, fontFace: F.BODY, margin: 0
});

addPageNum(s3, 1);

// ========================================
// 슬라이드 4: <p> 문단 태그
// ========================================
const s4 = pres.addSlide();
s4.background = { color: C.WHITE };
addHeader(s4, 'TAG 02');
addSlideTitle(s4, '<p> 문단 태그', '본문 텍스트를 담는 가장 기본적인 태그');

addSectionTitle(s4, '사용법', '문단 단위로 텍스트를 묶어 줍니다. 자동으로 위아래 여백이 생깁니다.', 0.5, 2.0);

addCodeBox(s4,
  '<p>첫 번째 문단입니다.</p>\n<p>두 번째 문단입니다.\n   줄바꿈은 무시됩니다.</p>',
  0.5, 2.8, 5.5, 2.0
);

s4.addShape(pres.shapes.RECTANGLE, {
  x: 6.5, y: 2.8, w: 6.3, h: 2.0,
  fill: { color: C.LIGHT_BG },
  line: { color: 'E0E0E0', width: 1 },
  rectRadius: 0.1
});
s4.addText('▶ 결과', {
  x: 6.7, y: 2.9, w: 2, h: 0.3,
  fontSize: 10, fontFace: F.SUBTITLE, color: C.MID_GRAY, margin: 0
});
s4.addText('첫 번째 문단입니다.', {
  x: 6.7, y: 3.3, w: 5.8, h: 0.4,
  fontSize: 14, fontFace: F.BODY, color: C.BLACK, margin: 0
});
s4.addText('두 번째 문단입니다. 줄바꿈은 무시됩니다.', {
  x: 6.7, y: 3.9, w: 5.8, h: 0.4,
  fontSize: 14, fontFace: F.BODY, color: C.BLACK, margin: 0
});

s4.addText([
  { text: '✔ ', options: { color: C.BLUE, bold: true } },
  { text: 'HTML에서 줄바꿈은 <br> 태그를 사용해야 합니다.', options: { color: C.BLACK } }
], {
  x: 0.5, y: 5.3, w: 12, h: 0.4,
  fontSize: 13, fontFace: F.BODY, margin: 0
});
s4.addText([
  { text: '✔ ', options: { color: C.BLUE, bold: true } },
  { text: '<p> 태그는 블록 요소로, 자동으로 줄바꿈됩니다.', options: { color: C.BLACK } }
], {
  x: 0.5, y: 5.75, w: 12, h: 0.4,
  fontSize: 13, fontFace: F.BODY, margin: 0
});

addPageNum(s4, 2);

// ========================================
// 슬라이드 5: <a> 링크 태그
// ========================================
const s5 = pres.addSlide();
s5.background = { color: C.WHITE };
addHeader(s5, 'TAG 03');
addSlideTitle(s5, '<a> 링크 태그', '다른 페이지나 사이트로 이동하는 하이퍼링크');

addSectionTitle(s5, '사용법', 'href 속성에 이동할 주소를 지정합니다.', 0.5, 2.0);

addCodeBox(s5,
  '<a href="https://www.naver.com">\n  네이버로 이동\n</a>\n\n<a href="page2.html"\n   target="_blank">\n  새 탭에서 열기\n</a>',
  0.5, 2.8, 5.5, 2.8
);

s5.addShape(pres.shapes.RECTANGLE, {
  x: 6.5, y: 2.8, w: 6.3, h: 2.8,
  fill: { color: C.LIGHT_BG },
  line: { color: 'E0E0E0', width: 1 },
  rectRadius: 0.1
});
s5.addText('▶ 주요 속성', {
  x: 6.7, y: 2.9, w: 2, h: 0.3,
  fontSize: 10, fontFace: F.SUBTITLE, color: C.MID_GRAY, margin: 0
});

const attrs = [
  { attr: 'href', desc: '이동할 URL 주소' },
  { attr: 'target="_blank"', desc: '새 탭에서 열기' },
  { attr: 'target="_self"', desc: '현재 탭에서 열기 (기본값)' },
];
attrs.forEach((a, i) => {
  const ay = 3.4 + i * 0.7;
  s5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.7, y: ay, w: 2.2, h: 0.3,
    fill: { color: C.NAVY }, rectRadius: 0.05
  });
  s5.addText(a.attr, {
    x: 6.7, y: ay, w: 2.2, h: 0.3,
    fontSize: 10, fontFace: 'Consolas', color: C.WHITE,
    align: 'center', valign: 'middle', margin: 0
  });
  s5.addText(a.desc, {
    x: 9.1, y: ay, w: 3.5, h: 0.3,
    fontSize: 12, fontFace: F.BODY, color: C.BLACK,
    valign: 'middle', margin: 0
  });
});

s5.addText([
  { text: '✔ ', options: { color: C.BLUE, bold: true } },
  { text: '외부 링크에는 보안을 위해 rel="noopener"를 함께 사용합니다.', options: { color: C.BLACK } }
], {
  x: 0.5, y: 6.1, w: 12, h: 0.4,
  fontSize: 13, fontFace: F.BODY, margin: 0
});

addPageNum(s5, 3);

// ========================================
// 슬라이드 6: <img> 이미지 태그
// ========================================
const s6 = pres.addSlide();
s6.background = { color: C.WHITE };
addHeader(s6, 'TAG 04');
addSlideTitle(s6, '<img> 이미지 태그', '웹 페이지에 이미지를 삽입하는 태그');

addSectionTitle(s6, '사용법', '닫는 태그가 없는 셀프 클로징 태그입니다.', 0.5, 2.0);

addCodeBox(s6,
  '<img src="photo.jpg"\n     alt="사진 설명"\n     width="300"\n     height="200">',
  0.5, 2.8, 5.5, 2.2
);

s6.addShape(pres.shapes.RECTANGLE, {
  x: 6.5, y: 2.8, w: 6.3, h: 2.2,
  fill: { color: C.LIGHT_BG },
  line: { color: 'E0E0E0', width: 1 },
  rectRadius: 0.1
});
s6.addText('▶ 주요 속성', {
  x: 6.7, y: 2.9, w: 2, h: 0.3,
  fontSize: 10, fontFace: F.SUBTITLE, color: C.MID_GRAY, margin: 0
});

const imgAttrs = [
  { attr: 'src', desc: '이미지 파일 경로 (필수)' },
  { attr: 'alt', desc: '대체 텍스트 — 접근성 (필수)' },
  { attr: 'width / height', desc: '이미지 크기 지정' },
];
imgAttrs.forEach((a, i) => {
  const ay = 3.4 + i * 0.5;
  s6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.7, y: ay, w: 2.2, h: 0.3,
    fill: { color: C.NAVY }, rectRadius: 0.05
  });
  s6.addText(a.attr, {
    x: 6.7, y: ay, w: 2.2, h: 0.3,
    fontSize: 10, fontFace: 'Consolas', color: C.WHITE,
    align: 'center', valign: 'middle', margin: 0
  });
  s6.addText(a.desc, {
    x: 9.1, y: ay, w: 3.5, h: 0.3,
    fontSize: 12, fontFace: F.BODY, color: C.BLACK,
    valign: 'middle', margin: 0
  });
});

s6.addText([
  { text: '⚠ ', options: { color: C.RED, bold: true } },
  { text: 'alt 속성은 시각장애인 스크린리더와 SEO에 매우 중요합니다!', options: { color: C.BLACK } }
], {
  x: 0.5, y: 5.5, w: 12, h: 0.4,
  fontSize: 13, fontFace: F.BODY, margin: 0
});
s6.addText([
  { text: '✔ ', options: { color: C.BLUE, bold: true } },
  { text: '<img>는 닫는 태그 없이 단독으로 사용하는 빈 요소(void element)입니다.', options: { color: C.BLACK } }
], {
  x: 0.5, y: 5.95, w: 12, h: 0.4,
  fontSize: 13, fontFace: F.BODY, margin: 0
});

addPageNum(s6, 4);

// ========================================
// 슬라이드 7: <ul> / <li> 목록 태그
// ========================================
const s7 = pres.addSlide();
s7.background = { color: C.WHITE };
addHeader(s7, 'TAG 05');
addSlideTitle(s7, '<ul> / <li> 목록 태그', '항목을 나열할 때 사용하는 목록 태그');

addSectionTitle(s7, '순서 없는 목록 vs 순서 있는 목록', null, 0.5, 2.0);

// 좌: ul
addCodeBox(s7,
  '<!-- 순서 없는 목록 -->\n<ul>\n  <li>항목 1</li>\n  <li>항목 2</li>\n  <li>항목 3</li>\n</ul>',
  0.5, 2.6, 5.8, 2.3
);

// 우: ol
addCodeBox(s7,
  '<!-- 순서 있는 목록 -->\n<ol>\n  <li>첫 번째</li>\n  <li>두 번째</li>\n  <li>세 번째</li>\n</ol>',
  6.8, 2.6, 5.8, 2.3
);

// 결과 비교
s7.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 5.2, w: 5.8, h: 1.5,
  fill: { color: C.LIGHT_BG },
  line: { color: 'E0E0E0', width: 1 },
  rectRadius: 0.1
});
s7.addText('• 항목 1\n• 항목 2\n• 항목 3', {
  x: 0.8, y: 5.3, w: 5, h: 1.3,
  fontSize: 13, fontFace: F.BODY, color: C.BLACK, margin: 0
});

s7.addShape(pres.shapes.RECTANGLE, {
  x: 6.8, y: 5.2, w: 5.8, h: 1.5,
  fill: { color: C.LIGHT_BG },
  line: { color: 'E0E0E0', width: 1 },
  rectRadius: 0.1
});
s7.addText('1. 첫 번째\n2. 두 번째\n3. 세 번째', {
  x: 7.1, y: 5.3, w: 5, h: 1.3,
  fontSize: 13, fontFace: F.BODY, color: C.BLACK, margin: 0
});

addPageNum(s7, 5);

// ========================================
// 슬라이드 8: 정리 테이블
// ========================================
const s8 = pres.addSlide();
s8.background = { color: C.WHITE };
addHeader(s8, '정리');
addSlideTitle(s8, 'HTML 기본 태그 요약', '5가지 태그만 알면 기본적인 웹 페이지를 만들 수 있습니다');

const tableHeaders = ['태그', '용도', '예시'].map(h => ({
  text: h,
  options: {
    fill: { color: C.TBL_HEADER }, color: C.WHITE, bold: true,
    fontSize: 12, fontFace: F.SUBTITLE, align: 'center', valign: 'middle',
    border: { pt: 0.5, color: 'CCCCCC' }
  }
}));

const tableRows = [
  ['<h1>~<h6>', '제목 (Heading)', '<h1>제목</h1>'],
  ['<p>', '문단 (Paragraph)', '<p>본문 내용</p>'],
  ['<a>', '링크 (Anchor)', '<a href="url">링크</a>'],
  ['<img>', '이미지 (Image)', '<img src="img.jpg" alt="설명">'],
  ['<ul> / <li>', '목록 (List)', '<ul><li>항목</li></ul>'],
].map((row, ri) => row.map(cell => ({
  text: cell,
  options: {
    fill: { color: ri % 2 === 0 ? C.WHITE : C.TBL_ROW_ALT },
    color: C.BLACK, fontSize: 11, fontFace: F.BODY, valign: 'middle',
    border: { pt: 0.5, color: 'E0E0E0' }
  }
})));

s8.addTable([tableHeaders, ...tableRows], {
  x: 0.5, y: 2.2, w: 12.3, colW: [2.0, 3.5, 6.8], autoPage: false
});

s8.addText([
  { text: '💡 TIP: ', options: { color: C.BLUE, bold: true, fontSize: 14 } },
  { text: '이 5가지 태그로 시작해서, 점차 새로운 태그를 배워나가세요!', options: { color: C.BLACK, fontSize: 14 } }
], {
  x: 0.5, y: 5.8, w: 12, h: 0.5, fontFace: F.BODY, margin: 0
});

addPageNum(s8, 6);

// ========================================
// 슬라이드 9: THANK YOU
// ========================================
const thanks = pres.addSlide();
thanks.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.33, h: 4.875,
  fill: { color: C.NAVY_DARK }
});
thanks.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 4.875, w: 13.33, h: 2.625,
  fill: { color: 'F5F5F5' }
});
thanks.addText('THANK YOU', {
  x: 1.5, y: 2.5, w: 10, h: 1.2,
  fontSize: 48, fontFace: F.TITLE_XL, color: C.WHITE, margin: 0
});
thanks.addText('HTML 기본 태그 학습을 마칩니다', {
  x: 1.5, y: 3.8, w: 10, h: 0.4,
  fontSize: 14, fontFace: F.BODY, color: C.BLUE_BRIGHT, margin: 0
});

// ===== 파일 저장 =====
pres.writeFile({ fileName: 'D:/Dropbox/workspace/_Study/2주차/html-css-js/HTML_기본태그_소개.pptx' })
  .then(() => console.log('PPTX 생성 완료!'))
  .catch(err => console.error(err));
