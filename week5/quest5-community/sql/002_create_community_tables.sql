-- ===========================================================
-- Q5 (게시판) 테이블 — posts / comments / reactions
-- ===========================================================

CREATE TABLE IF NOT EXISTS app.community_posts (
  id          BIGSERIAL    PRIMARY KEY,
  user_id     BIGINT       NOT NULL REFERENCES app.auth_users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  content     TEXT         NOT NULL,
  view_count  INT          DEFAULT 0,
  is_deleted  BOOLEAN      DEFAULT FALSE,
  created_at  TIMESTAMP    DEFAULT NOW(),
  updated_at  TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON app.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON app.community_posts(created_at DESC);


CREATE TABLE IF NOT EXISTS app.community_comments (
  id          BIGSERIAL PRIMARY KEY,
  post_id     BIGINT    NOT NULL REFERENCES app.community_posts(id) ON DELETE CASCADE,
  user_id     BIGINT    NOT NULL REFERENCES app.auth_users(id) ON DELETE CASCADE,
  content     TEXT      NOT NULL,
  is_deleted  BOOLEAN   DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON app.community_comments(post_id);


CREATE TABLE IF NOT EXISTS app.community_reactions (
  id          BIGSERIAL   PRIMARY KEY,
  post_id     BIGINT      NOT NULL REFERENCES app.community_posts(id) ON DELETE CASCADE,
  user_id     BIGINT      NOT NULL REFERENCES app.auth_users(id) ON DELETE CASCADE,
  reaction    VARCHAR(20) NOT NULL CHECK (reaction IN ('like', 'helpful', 'celebrate')),
  created_at  TIMESTAMP   DEFAULT NOW(),
  UNIQUE (post_id, user_id, reaction)
);

COMMENT ON TABLE app.community_posts     IS 'Q5 게시판 글';
COMMENT ON TABLE app.community_comments  IS 'Q5 게시판 댓글';
COMMENT ON TABLE app.community_reactions IS 'Q5 좋아요·도움·축하 (사용자당 게시글당 reaction별 1회)';
