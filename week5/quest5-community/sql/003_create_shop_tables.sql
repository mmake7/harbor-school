-- ===========================================================
-- Q6 (쇼핑) 테이블 — products / cart / orders
-- ===========================================================

CREATE TABLE IF NOT EXISTS app.shop_products (
  id          BIGSERIAL    PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       INT          NOT NULL CHECK (price >= 0),
  image_url   VARCHAR(500),
  category    VARCHAR(50),
  stock       INT          DEFAULT 100 CHECK (stock >= 0),
  is_active   BOOLEAN      DEFAULT TRUE,
  created_at  TIMESTAMP    DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS app.shop_cart (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT    NOT NULL REFERENCES app.auth_users(id) ON DELETE CASCADE,
  product_id  BIGINT    NOT NULL REFERENCES app.shop_products(id) ON DELETE CASCADE,
  quantity    INT       NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);


CREATE TABLE IF NOT EXISTS app.shop_orders (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     BIGINT      NOT NULL REFERENCES app.auth_users(id) ON DELETE CASCADE,
  total_price INT         NOT NULL CHECK (total_price >= 0),
  status      VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  items_json  JSONB       NOT NULL,
  created_at  TIMESTAMP   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON app.shop_orders(user_id);

COMMENT ON TABLE app.shop_products IS 'Q6 상품 마스터';
COMMENT ON TABLE app.shop_cart     IS 'Q6 장바구니 (UNIQUE user_id+product_id, 같은 상품은 quantity 증가)';
COMMENT ON TABLE app.shop_orders   IS 'Q6 주문 (items_json = 주문 시점 스냅샷)';
