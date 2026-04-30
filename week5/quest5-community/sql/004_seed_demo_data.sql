-- ===========================================================
-- 데모 데이터 — 게시판 5건 + 상품 8건
-- 멱등: NOT EXISTS 서브쿼리로 중복 INSERT 방지
-- ===========================================================

-- ── 게시판 5건 (test@prime.local 사용자) ──
INSERT INTO app.community_posts (user_id, title, content)
SELECT u.id, '5주차 시작!', 'harbor.school 5주차 들어왔어요. 첫날부터 뇌가 풀가동되는 느낌이네요. 다들 화이팅!'
  FROM app.auth_users u
 WHERE u.email = 'test@prime.local'
   AND NOT EXISTS (SELECT 1 FROM app.community_posts WHERE title = '5주차 시작!' AND user_id = u.id);

INSERT INTO app.community_posts (user_id, title, content)
SELECT u.id, 'AI 비서 만들어봤어요', 'Claude API로 가계부 분석 비서 만들어보니, 시스템 프롬프트 한 줄이 결과 품질을 결정하네요. "데이터에 없으면 솔직히" 룰이 핵심.'
  FROM app.auth_users u
 WHERE u.email = 'test@prime.local'
   AND NOT EXISTS (SELECT 1 FROM app.community_posts WHERE title = 'AI 비서 만들어봤어요' AND user_id = u.id);

INSERT INTO app.community_posts (user_id, title, content)
SELECT u.id, '흑백 미니멀 디자인 후기', 'PPT 16장 전부 흑백 + Pretendard 폰트로 통일했더니 의외로 컨셉이 명확해졌어요. 색깔 욕심 줄이는 게 빠른 길.'
  FROM app.auth_users u
 WHERE u.email = 'test@prime.local'
   AND NOT EXISTS (SELECT 1 FROM app.community_posts WHERE title = '흑백 미니멀 디자인 후기' AND user_id = u.id);

INSERT INTO app.community_posts (user_id, title, content)
SELECT u.id, 'Vercel 배포 함정 정리', 'Authentication Protection이 기본 켜져 있어서 API가 401 뱉던 사연. Settings → Deployment Protection → Disabled로 해결.'
  FROM app.auth_users u
 WHERE u.email = 'test@prime.local'
   AND NOT EXISTS (SELECT 1 FROM app.community_posts WHERE title = 'Vercel 배포 함정 정리' AND user_id = u.id);

INSERT INTO app.community_posts (user_id, title, content)
SELECT u.id, '노션 MCP 처음 써본 후기', 'Claude Code에서 노션 페이지를 직접 만들 수 있다는 게 새롭네요. OAuth 한 번 셋업하면 끝, 회고 시스템 뼈대를 30분 만에 깔았어요.'
  FROM app.auth_users u
 WHERE u.email = 'test@prime.local'
   AND NOT EXISTS (SELECT 1 FROM app.community_posts WHERE title = '노션 MCP 처음 써본 후기' AND user_id = u.id);


-- ── 상품 8건 ──
INSERT INTO app.shop_products (name, description, price, category, stock)
SELECT '노트북 거치대', '책상 위 노트북 화면을 눈높이로 올려 거북목 예방. 알루미늄 6단계 각도 조절.', 18000, '데스크', 50
 WHERE NOT EXISTS (SELECT 1 FROM app.shop_products WHERE name = '노트북 거치대');

INSERT INTO app.shop_products (name, description, price, category, stock)
SELECT '무선 이어폰', 'ANC + 외부 소리 모드. 한 번 충전으로 8시간 재생, 케이스 합산 32시간.', 89000, '음향', 30
 WHERE NOT EXISTS (SELECT 1 FROM app.shop_products WHERE name = '무선 이어폰');

INSERT INTO app.shop_products (name, description, price, category, stock)
SELECT '머그컵', '350ml 도자기, 전자레인지·식기세척기 호환. 흑백 미니멀 라인.', 8500, '라이프', 100
 WHERE NOT EXISTS (SELECT 1 FROM app.shop_products WHERE name = '머그컵');

INSERT INTO app.shop_products (name, description, price, category, stock)
SELECT '기계식 키보드', '저소음 적축, 87키 텐키리스. USB-C 분리형 케이블.', 145000, '데스크', 20
 WHERE NOT EXISTS (SELECT 1 FROM app.shop_products WHERE name = '기계식 키보드');

INSERT INTO app.shop_products (name, description, price, category, stock)
SELECT 'UX 디자인 책', '실무 사례 중심의 입문서. 흑백 인쇄, 320쪽.', 22000, '도서', 80
 WHERE NOT EXISTS (SELECT 1 FROM app.shop_products WHERE name = 'UX 디자인 책');

INSERT INTO app.shop_products (name, description, price, category, stock)
SELECT '가습기', '4L 대용량, 무드등 겸용, 자동 습도 제어. 침실 사이즈에 적합.', 35000, '라이프', 40
 WHERE NOT EXISTS (SELECT 1 FROM app.shop_products WHERE name = '가습기');

INSERT INTO app.shop_products (name, description, price, category, stock)
SELECT '백팩', '15.6인치 노트북 수납, 발수 가공, 내부 정리 포켓 8개. 출퇴근·여행 겸용.', 65000, '가방', 25
 WHERE NOT EXISTS (SELECT 1 FROM app.shop_products WHERE name = '백팩');

INSERT INTO app.shop_products (name, description, price, category, stock)
SELECT '모니터 받침대', '하부 수납 공간 제공. 27인치까지, 최대 30kg 하중.', 28000, '데스크', 35
 WHERE NOT EXISTS (SELECT 1 FROM app.shop_products WHERE name = '모니터 받침대');
