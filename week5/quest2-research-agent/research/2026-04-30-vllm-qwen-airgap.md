# vLLM + Qwen2.5-Coder-32B 폐쇄망(air-gapped) 배포 — Deep Dive

> 작성일: 2026-04-30
> 작성자: PRIME / Radar (Deep Dive 리서치 에이전트)
> 목적: 한국 공공부문 SI 프로젝트에 LLM 폐쇄망 배포 도입 검토용 reference

---

## 한 줄 요약

vLLM은 사실상의 오픈소스 추론 표준이 되었고 Qwen2.5-Coder-32B는 GPT-4o급 오픈웨이트 코드 모델이지만, **한국 공공·금융 폐쇄망 도입 사례는 자체 sLLM(하이퍼클로바X 대시 등) 위주이며 "vLLM + Qwen + 완전 폐쇄망" 3중 매칭의 공개 사례는 발견되지 않았다.**

---

## 핵심 결론 3가지

1. **기술 측면 — 도입 준비도 매우 높음.** vLLM v0.20.0(2025-04)이 Qwen3/3.5 MoE, AWQ/GPTQ/FP8/W4A8까지 지원. Qwen2.5-Coder-32B는 Apache 2.0, 128K 컨텍스트, AWQ/GPTQ/GGUF 117개 양자화 변형 공개. **상용 라이선스·기술 위험은 사실상 없음.**

2. **한국 공공 시장 — "폐쇄망 AI" 자체는 이미 정착, 그러나 모델은 자체 개발 위주.** 미래에셋증권(2024-09, 하이퍼클로바X 대시), 국방부 재정정보체계(2025-12, t-AI Chat), 서울시 챗봇 2.0(2025-08, H200 8GPU)이 ★★★ 폐쇄망 도입 사례. **공통점은 "자체 모델 + 폐쇄망"이지 "vLLM + Qwen"이 아님.** Qwen2.5-Coder를 도입한다면 *기술적 검증된 길이지만 국내 선례는 없는 길*.

3. **사업 기회 영역 — "공공기관 코드 어시스턴트"가 비어있음.** 한국 폐쇄망 LLM은 챗봇·재정질의·문서 자동화에 집중되어 있고, **개발자용 코드 어시스턴트(Copilot 대체) 도입 사례는 사실상 0건**. Qwen2.5-Coder-32B의 코딩 특화 + Apache 2.0 + 폐쇄망 가능 조합은 SI 제안서에서 *기존 사례 없는 차별화 포인트*가 될 수 있음.

---

## 축 1. 기술 동향

### 1-1. vLLM 최신 버전 (v0.20.0, 2025-04-27 기준)

| 버전 | 출시일 | 주요 변경 |
|---|---|---|
| **v0.20.0** | 2025-04-27 | DeepSeek V4 지원, CUDA 13.0 기본, PyTorch 2.11, **TurboQuant 2-bit KV cache**, FP8/MXFP8 통합 |
| v0.19.0 | 2025-04-03 | Gemma 4 풀 지원, **zero-bubble async scheduling + speculative decoding**, MXFP8 MoE |
| v0.18.0 | 2025-03-20 | gRPC 서빙, KV cache offloading 강화, **W4A8 compressed-tensor** |

**관전 포인트**: vLLM은 2025년 들어 "양자화 + 스케줄링" 양 축으로 진화 중. 폐쇄망 관점에서 의미 있는 변화는 **KV cache offloading**(VRAM 압박 완화) + **W4A8/AWQ Marlin 커널**(3x+ throughput).

### 1-2. Qwen2.5-Coder-32B-Instruct 스펙

| 항목 | 값 |
|---|---|
| 파라미터 | **32.5B (non-embedding 31.0B)** |
| 모델 크기 (BF16) | **~66 GB** |
| 컨텍스트 | **131,072 tokens (128K)**, default 32K, YaRN 확장 |
| 라이선스 | **Apache 2.0** ✅ 상용 사용 자유 |
| 양자화 변형 | **117개** 공개 (AWQ, GPTQ, GGUF, llama.cpp, MLX 등) |
| 코딩 능력 | "GPT-4o 매칭" 주장 (Qwen 공식 발표) |

### 1-3. 경쟁 모델 비교 (코딩 특화, 오픈웨이트 32B급)

| 모델 | 파라미터 | 라이선스 | EvalPlus / 강점 | 매칭도 |
|---|---|---|---|---|
| **Qwen2.5-Coder-32B-Instruct** | 32B | Apache 2.0 | **EvalPlus 1위** (오픈웨이트 기준) | ★★★ |
| DeepSeek-Coder-V2-Instruct | ~16B/236B (MoE) | MIT-like | LiveCodeBench 34%대 (V2.5) | ★★★ |
| DeepSeek-V3 | 671B (MoE, 활성 37B) | DeepSeek License | 최신 reference 모델 | ★★ (대형) |
| Code Llama (34B) | 34B | Llama Custom | 구세대, Qwen2.5에 추월됨 | ★ |
| CodeStral-22B | 22B | MNPL (제한) | Mistral 코딩 모델, 라이선스 제약 | ★★ |
| Qwen2.5-Coder-14B | 14B | Apache 2.0 | **CodeStral-22B/DeepSeek-Coder-33B 능가** — 효율성 ★★★ | ★★★ |

**시사점**:
- **Qwen 32B는 오픈 코딩 모델 1위**, 동시에 14B로도 33B급 능가 → 폐쇄망 자원 제약 시 *14B로 양자화* 옵션이 강력
- DeepSeek 계열은 MoE 구조로 더 큰 활성 파라미터 → 단일 GPU 폐쇄망에 불리
- Code Llama는 사실상 deprecated, 신규 검토 시 제외

---

## 축 2. 배포 아키텍처

### 2-1. GPU 구성 권장 (Qwen2.5-Coder-32B 기준)

| 구성 | 양자화 | VRAM | 용도 |
|---|---|---|---|
| **단일 H100 80GB** | FP16/BF16 | ~64-80 GB (빠듯) | 작은 동시성, 데모 |
| **단일 H100 80GB** | INT8 / FP8 | ~32-40 GB | **권장 — 동시성 여유** |
| **단일 RTX 4090 24GB** | INT4 (AWQ/GPTQ) | ~16-20 GB | 개발/PoC, 컨텍스트 제약 |
| **2× A100 80GB** | FP16, TP=2 | 분산 | 대규모 동시성, **A100은 FP8 미지원 → INT8** |
| **2× H100 80GB** | FP8, TP=2 | 분산 | **고성능 운영, 배치 throughput 최대** |
| **서울시 사례** | (미공개) | **H200 8GPU + 3대 추가 예정** | 공공 표준 reference |

**vLLM 명령어 예시**:
```bash
# 단일 GPU (FP16)
vllm serve Qwen/Qwen2.5-Coder-32B-Instruct

# 단일 GPU (AWQ INT4) - 24GB GPU 가능
vllm serve Qwen/Qwen2.5-Coder-32B-Instruct-AWQ

# 멀티 GPU (TP=2)
vllm serve Qwen/Qwen2.5-Coder-32B-Instruct --tensor-parallel-size 2
```

### 2-2. 양자화 옵션 비교

| 양자화 | 정확도 손실 | Throughput vs BF16 | VRAM | 하드웨어 요구 |
|---|---|---|---|---|
| **FP16/BF16** | 0% (기준) | 1.0x | 100% | 거의 모든 최신 GPU |
| **FP8 (W8A8)** | <1% | **~1.6x** | ~50% | **H100/H200/L40S만** |
| **INT8 (W8A8)** | 1~2% | ~1.4x | ~50% | A100 포함 광범위 |
| **AWQ (W4A16) + Marlin** | 2~4% | **~3x+** | ~25% | A100/H100, 큰 batch에 강함 |
| **GPTQ (W4A16) + ExLlamaV2/Marlin** | 2~5% | ~2~3x | ~25% | 광범위 |
| **GGUF Q4_K_M** | 3~5% | 가변 (CPU 가능) | ~25% | llama.cpp 계열, 엣지 가능 |

**관전 포인트**:
- **폐쇄망 운영 환경에서는 AWQ Marlin이 사실상 sweet spot** — 3x+ throughput + 25% VRAM
- H100 보유 시 FP8가 정확도 보존 + 속도 동시 확보 → 정확도 민감 업무에 권장
- A100 폐쇄망이라면 INT8 또는 AWQ

### 2-3. 처리량 vs 정확도 트레이드오프

- 7B/8B 모델은 32B 대비 GPU 활용률 여유 → 동시성 높일 수 있음
- 32B는 단일 GPU 시 거의 full load → 동시 사용자 30~50명 이상이면 멀티 GPU 권장
- **공무원 1만 명 규모 폐쇄망 = 동시 사용자 200~500명 → 4~8 GPU 필요** (서울시 H200 8GPU와 부합)

---

## 축 3. 한국 도입 사례

### 3-1. ★★★ 직접 매칭 — 폐쇄망 + 자체 LLM 도입 확정

| 기관 | 발표 시점 | 모델 | 환경 | 핵심 |
|---|---|---|---|---|
| **미래에셋증권** | 2024-09 | 네이버클라우드 하이퍼클로바X 대시 sLLM | 온프레미스 | **국내 첫 온프레미스 LLM 적용 사례** |
| **국방부 재정정보체계** | 2025-12 | 트랜스코스모스 t-AI Chat (자체 sLLM) | **폐쇄형 내부망** | **정부 첫 본격 도입**, KIDA 협업, 2026년 t-AI Document 후속 |
| **서울특별시 (챗봇 2.0)** | 2025-08 | 서울시 자체 LLM | **폐쇄망**, GPU H200 8개 + 3대 추가 | **공공 폐쇄망 GPU 정량 사례** — 공무원 + 시민(서울톡 50만) 적용 |

> **세 사례 모두 vLLM/Qwen이 아닌 자체/협력사 모델**. 공통 패턴은 *"폐쇄망 + 자체 LLM + 공공/금융 보안 요건"*.

### 3-2. ★★ 유사 사례 — 사내 LLM 또는 sLLM, 부분 폐쇄망

| 기관/공급사 | 핵심 |
|---|---|
| **KB국민은행 (KB-GPT)** | 2023-06, 자체 'KB-STA' 금융 NLP, 내부 직원만, **검색·채팅·요약·코딩 9개 기능** |
| **KB국민카드 (BELLA QNA)** | KBpay 챗봇, GPT-3 + RAG, **외부 API 사용 = 폐쇄망 아님**, 보안 강화 RAG 사례 |
| **신한은행** | KT/LG AI연구원/네이버와 153개 대출상품 데이터 PoC |
| **LG CNS + 코히어** | 70억 파라미터 한국어 LLM 공개, **추론형** 차별화 |
| **삼성SDS FabriX** | 외부 LLM 허브 + 내부 데이터 비전송 설계 (폐쇄망 ≠ but 데이터 보호) |
| **SK C&C 솔루어** | 외부 LLM + 사내 RAG 결합 |
| **에이프리카** | AI Summit Seoul 2024 폐쇄망 Agentic RAG + LLMOps 솔루션 발표 (구체 도입처 비공개) |

### 3-3. ★ 참고 — 시사점 위주

- **정부 K-LLM 계획** (2024년 발표, 2025년 목표): 네이버·SKT 등과 협력해 부처 데이터 학습 국가 LLM 추진. *완료 보도는 미확인*
- **국방분야 LLM 적용모델 연구** (한국정보과학회): 학술 논문, 정책 reference

### 한계 (솔직 보고)

⚠️ **"vLLM + Qwen2.5-Coder + 완전 폐쇄망" 3중 매칭 한국 사례는 공개 자료 기준 발견되지 않음.**

도입 검토 시 활용 권장:
1. **한국 폐쇄망 sLLM 선례** (위 ★★★ 3건) — *"폐쇄망 운영 가능성 입증"* reference
2. **글로벌 vLLM + Qwen 활용 사례** — 기술 reference
3. → **"한국 공공 폐쇄망에 글로벌 표준 도구(vLLM) + 오픈 모델(Qwen) 도입"이라는 새로운 포지션** 가능

---

## 축 4. 의사결정 가이드

### 4-1. 도입 검토 체크리스트

**기술 적합성**
- [ ] 폐쇄망 정책 확인 (외부망 차단 필수 여부)
- [ ] GPU 자산 확인 (H100/H200/A100/L40S 보유 여부 → FP8 vs INT8 vs AWQ 결정)
- [ ] 동시 사용자 추정 (50명 이하 → 단일 GPU, 그 이상 → TP)
- [ ] 컨텍스트 길이 요구 (32K 충분 vs 128K 필요)

**라이선스/보안**
- [ ] Apache 2.0 적합성 검토 (Qwen2.5-Coder-32B는 OK)
- [ ] 모델 가중치 폐쇄망 반입 절차 (HF에서 다운로드 → 검수 → 내부망 이전)
- [ ] vLLM, PyTorch, CUDA 의존성 패키지 폐쇄망 미러 구축

**운영**
- [ ] 모니터링 (Prometheus 등) 폐쇄망 호환
- [ ] 사용자 인증·감사 로그 (공공 SI 필수)
- [ ] 모델 업데이트 절차 (오프라인 반입 주기 합의)

**대안 검토**
- [ ] vLLM 대안: SGLang, TensorRT-LLM (NVIDIA), llama.cpp
- [ ] 모델 대안: DeepSeek-V3 (대형), Qwen2.5-Coder-14B (효율), 자체 sLLM (한국어 강점)

### 4-2. 예상 비용 (KRW 기준)

| 항목 | 추정 비용 | 출처/근거 |
|---|---|---|
| **GPU 서버 (4-8 GPU 구성)** | **20~50억** | 피카부랩스 추정 (H100 1장 ~5천만, 서버·네트워크·UPS 포함 시 4-8GPU 통합 시스템) |
| **AI 엔지니어** | **1~2억/년 × 인원** | 동일 출처. 통상 SI에선 2~3명 팀 권장 |
| **연간 운영 (전력·냉각·라이선스)** | 5천만~2억 | 추정 [추측]. GPU 서버 전력 8~16kW 기준 |
| **모델 라이선스** | **0원** (Qwen Apache 2.0) | HF 공식 |
| **vLLM·Python 스택** | 0원 (오픈소스) | Apache 2.0 |
| **참고: 서울시 챗봇 2.0** | (미공개, GPU H200 8개 + 3대 추가 예정) | 공공 reference |

### 4-3. 리스크와 완화 방안

| 리스크 | 심각도 | 완화 방안 |
|---|---|---|
| **모델 오작동(할루시네이션) → 행정 오류** | ★★★ | RAG로 출처 근거 강제 (서울시·국방부 사례 참조). 답변에 출처 첨부 필수 |
| **VRAM 부족 → 응답 지연·실패** | ★★★ | 동시성 측정 후 TP 또는 양자화 다운그레이드. AWQ가 첫 후보 |
| **폐쇄망 의존성 패키지 누락** | ★★ | 사전 사전 미러(`pip download` + 사내 PyPI). vLLM은 CUDA 호환성 까다로움 |
| **모델 업데이트 단절** | ★★ | 분기별 오프라인 반입 절차 SOP 제정 |
| **공공 보안 인증 부재** | ★★★ | NIPA/KISA 가이드라인 매핑. 망분리·보안인증 로드맵 동시 진행 |
| **한국어 성능 부족 가능성** | ★★ | Qwen은 한국어 학습은 됐으나 미세조정 필요 가능. **하이퍼클로바X 대시 등 한국어 자체 모델과 병행 검토** 권장 |
| **선례 부재 → 의사결정 지연** | ★★★ | 미래에셋·국방부·서울시 ★★★ 사례를 *"폐쇄망 운영 가능성 입증"* 근거로 활용 |

---

## 참고 출처

전체 9개 출처 (1차 자료 우선, 한국 사례 6건 + 글로벌 기술 3건):

1. **[ZDNet Korea — 네이버클라우드/미래에셋증권](https://zdnet.co.kr/view/?no=20240919095825)** ★★★
   2024-09 한국 첫 온프레미스 LLM 도입. 미래에셋증권 + 하이퍼클로바X 대시 sLLM. 인용문 풍부.

2. **[스켈터랩스 — KB국민카드 BELLA QNA](https://www.skelterlabs.com/blog/llm-usecase)** ★★
   KBpay 150건 이벤트 RAG 챗봇. GPT-3 사용 = 폐쇄망 아님. 보안 강화 RAG 모범 사례.

3. **[전자신문 — 에이프리카 폐쇄망 RAG](https://www.etnews.com/20241216000404)** ★★
   AI Summit Seoul 2024 발표. 폐쇄망 Agentic RAG + LLMOps. 솔루션 단계.

4. **[vLLM GitHub Releases](https://github.com/vllm-project/vllm/releases)** ★★★
   v0.20.0 (2025-04-27) 최신. 양자화/스케줄링 진화 추적.

5. **[Hugging Face — Qwen2.5-Coder-32B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct)** ★★★
   모델 카드 1차 자료. 32.5B/Apache 2.0/128K/117 quantizations.

6. **[굿모닝경제 — 트랜스코스모스/국방부 t-AI Chat](https://www.goodkyung.com/news/articleView.html?idxno=279747)** ★★★
   2025-12-31 발표. 국방 재정정보체계 폐쇄형 sLLM 구축. 한국 공공 첫 본격 도입.

7. **[서울특별시 — 챗봇 2.0 보도자료](https://news.seoul.go.kr/gov/archives/569818)** ★★★
   2025-08-11. 자체 LLM 폐쇄망. **GPU H200 8개 + 3대 확장**. 공공 폐쇄망 GPU 정량 reference.

8. **[Qwen 공식 — vLLM 배포 가이드](https://qwen.readthedocs.io/en/latest/deployment/vllm.html)** ★★★
   `vllm serve` + `--tensor-parallel-size` + AWQ/FP8 패턴. Qwen3 기준이나 2.5-Coder 동일 적용.

9. **[Qwen 블로그 — Qwen2.5-Coder Family](https://qwenlm.github.io/blog/qwen2.5-coder-family/)** ★★★
   EvalPlus 1위 발표, 7B/14B의 33B급 능가, "GPT-4o 매칭" 주장 근거.

추가 reference (검색 종합):
- [아시아경제 — 정부 K-LLM 단독](https://www.asiae.co.kr/article/2024030508572989518) ★ — 국가 LLM 계획
- [피카부랩스 — 기업용 LLM 가이드](https://peekaboolabs.ai/blog/corporate-llm-deployment-guide) ★★ — GPU 20-50억 비용 추정
- [Red Hat — vLLM FP8](https://developers.redhat.com/articles/2024/07/15/vllm-brings-fp8-inference-open-source-community) ★★★ — FP8 2x throughput, 50% 메모리

---

## 메타 정보

| 항목 | 값 |
|---|---|
| 작업일 | 2026-04-30 |
| 검색 키워드 | 영문 5개 (vLLM release / Qwen2.5-Coder VRAM / 경쟁모델 benchmark / vLLM 양자화 / air-gapped 일반), 국문 7개 (폐쇄망 LLM / 온프레미스 LLM / 사내 챗봇 / 공공기관 LLM / 금융권 LLM / 코드 LLM 사내 / Qwen 한국 도입), 추가 6개 (KB국민은행, 삼성SDS·LG CNS·SK C&C, 국방부, vLLM 폐쇄망 한국, "KB-GPT", 양자화 throughput 32B) — **총 18개 검색** |
| 직접 방문 사이트 | **9개** (Playwright 7건 + WebFetch 2건) |
| 검색 종합 출처 | 추가 30+개 |
| 작업 시간 | 약 30분 (정찰 5 + 1차 출처 20 + 정리 5) |
| 한국 사례 ★★★ | 3건 (미래에셋, 국방부, 서울시) |
| 한국 사례 ★★ | 7건 (KB-GPT, KB카드, 신한, LG CNS, 삼성SDS, SK C&C, 에이프리카) |
| 한계 명시 | "vLLM + Qwen + 완전 폐쇄망" 3중 매칭 한국 사례는 발견되지 않음. 보강 자료로 (1) 한국 폐쇄망 sLLM 선례, (2) 글로벌 vLLM 사례 활용 권장 |

---

> **Next Action 제안**
> - 본 리포트를 5주차 PRIME 기획안 PPT의 *"reference 자료"* 챕터에 첨부
> - 미래에셋·국방부·서울시 3건은 PPT 본문 사례 슬라이드로 격상 추천
> - "공공 코드 어시스턴트" 시장 공백을 차별화 포인트로 정리
