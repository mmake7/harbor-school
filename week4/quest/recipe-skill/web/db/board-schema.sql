-- =============================================================
-- 4주차 Q4: 혼삶톡 익명 게시판 스키마 (문서용)
-- 대상 DB: Supabase(PostgreSQL)
-- 실행 방법: Supabase Studio → SQL Editor에 복사 붙여넣기 후 실행
-- 주의: 앱 코드에서 자동 생성하지 않음. 이 파일을 직접 실행해야 함.
-- =============================================================

-- 1) 게시글
CREATE TABLE IF NOT EXISTS board_posts (
  id            BIGSERIAL PRIMARY KEY,
  category      TEXT NOT NULL CHECK (category IN ('고민','칭찬','응원','수다')),
  content       TEXT NOT NULL,
  nickname      TEXT NOT NULL,
  tags          TEXT[] NOT NULL DEFAULT '{}',
  like_count    INT  NOT NULL DEFAULT 0,
  cheer_count   INT  NOT NULL DEFAULT 0,
  sparkle_count INT  NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON board_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_posts_category   ON board_posts (category);

-- 2) 댓글
CREATE TABLE IF NOT EXISTS board_comments (
  id         BIGSERIAL PRIMARY KEY,
  post_id    BIGINT NOT NULL REFERENCES board_posts(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  nickname   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_board_comments_post_id ON board_comments (post_id);

-- 3) 반응 (공감/응원/칭찬) — session_id 기준 중복 방지
CREATE TABLE IF NOT EXISTS board_reactions (
  id            BIGSERIAL PRIMARY KEY,
  post_id       BIGINT NOT NULL REFERENCES board_posts(id) ON DELETE CASCADE,
  reaction_type TEXT   NOT NULL CHECK (reaction_type IN ('like','cheer','sparkle')),
  session_id    TEXT   NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, reaction_type, session_id)
);

CREATE INDEX IF NOT EXISTS idx_board_reactions_post    ON board_reactions (post_id);
CREATE INDEX IF NOT EXISTS idx_board_reactions_session ON board_reactions (session_id);

-- =============================================================
-- 샘플 데이터 (선택 실행)
-- =============================================================

INSERT INTO board_posts (category, content, nickname, tags) VALUES
  ('고민', '퇴근하고 혼자 밥 먹는 게 익숙해질 법도 한데 오늘따라 외롭네요. 다들 저녁 뭐 드셨나요?', '지친 고양이 #1024', ARRAY['외로움','저녁','혼밥']),
  ('칭찬', '오늘 냉장고 털어서 김치볶음밥 완성! 레시피 추천해준 AI 덕분에 버리는 재료 없이 다 썼어요.', '뿌듯한 부엉이 #7812', ARRAY['자취요리','김치볶음밥']),
  ('응원', '시험 준비하느라 매일 삼각김밥만 먹는 분들 화이팅! 오늘도 잘 버텨봅시다.', '다정한 여우 #4455', ARRAY['응원','시험']),
  ('수다', '계란을 한 판 샀는데 도저히 못 다 먹을 것 같아요. 계란 소비 꿀팁 있으신 분?', '배고픈 햄스터 #0321', ARRAY['계란','꿀팁']),
  ('고민', '자취 6개월차인데 아직도 장보기가 너무 어려워요. 1인분 계산이 자꾸 엉켜요.', '조용한 판다 #2201', ARRAY['장보기','1인분']);

INSERT INTO board_comments (post_id, content, nickname) VALUES
  (1, '오늘 저는 라면에 계란 두 개 풀어서 든든하게요. 혼자도 잘 해요!', '씩씩한 토끼 #9912'),
  (2, '저도 해봐야겠어요. 재료 뭐 쓰셨어요?', '감성 다람쥐 #6621'),
  (3, '같이 힘내요. 저도 삼각김밥 친구.', '따뜻한 펭귄 #4401');

INSERT INTO board_reactions (post_id, reaction_type, session_id) VALUES
  (1, 'like',    'seed-session-a'), (1, 'cheer',   'seed-session-b'),
  (2, 'sparkle', 'seed-session-c'), (2, 'like',    'seed-session-d'), (2, 'like', 'seed-session-e'),
  (3, 'cheer',   'seed-session-f'), (3, 'like',    'seed-session-g');

UPDATE board_posts SET like_count = 1, cheer_count = 1                 WHERE id = 1;
UPDATE board_posts SET like_count = 2, sparkle_count = 1                WHERE id = 2;
UPDATE board_posts SET like_count = 1, cheer_count = 1                 WHERE id = 3;
