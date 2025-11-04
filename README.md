# ctrl-j

웹 프로젝트 - ctrl-j

## 프로젝트 구조
```
ctrl-j/
├── index.html          # 메인 페이지
├── cdn/               # 공통 리소스
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   └── js/
│       ├── main.js
│       └── utils.js
├── pages/             # 추가 페이지들
│   ├── game/          # 게임 페이지
│   │   ├── tetris.html
│   │   └── cdn/       # 게임 리소스
│   │       ├── css/
│   │       └── js/
│   ├── tools/         # 도구
│   │   └── chatbot/   # AI 챗봇
│   │       ├── ai-chatbot.html
│   │       └── cdn/
│   │           ├── css/
│   │           └── js/
│   └── about/         # 소개 페이지
│       ├── intro.html
│       ├── profile.html
│       └── vision.html
├── config/            # 설정 파일
└── README.md
```

## 게임
- **테트리스**: `pages/game/tetris/tetris.html`
  - 조작법: 방향키로 이동/회전, 스페이스바로 즉시 낙하
  - 점수, 레벨, 라인 클리어 기능 포함
  - 모바일 반응형 지원 (터치 디바이스 최적화)
  - 스크롤 없는 풀스크린 게임 환경

- **스도쿠**: `pages/game/sudoku/sudoku.html`
  - 3단계 난이도 (쉬움, 보통, 어려움)
  - 타이머 및 힌트 시스템 (최대 3개)
  - 실시간 오류 검증 및 하이라이트
  - 모바일 터치 숫자 패드 지원
  - 자동 완성 감지

- **Chosen**: `pages/game/chosen/chosen.html`
  - URL 기반 텍스트 로그라이크 RPG
  - 회귀 시스템 (3가지 출신: 귀족, 빈민, 학자)
  - 시드 기반 랜덤 이벤트 및 스탯 체크
  - 태그 시스템으로 조건부 분기
  - Base64 URL Safe 인코딩으로 상태 저장

## 도구
- **AI 챗봇**: `pages/tools/chatbot/ai-chatbot.html`
  - Gemini API 기반 대화형 AI 인터페이스
  - 실시간 메시지 전송/수신
  - 재시도 로직 및 에러 처리
  - 모바일 반응형 UI
  - Enter 키로 메시지 전송 (Shift+Enter로 줄바꿈)

## 시작하기
1. `index.html`을 브라우저에서 열기
2. 게임 섹션에서 테트리스 클릭
3. "게임 시작" 버튼으로 플레이 시작

## 기술 스택
- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- CSS3 (Flexbox, Media Queries)
- 반응형 웹 디자인

## 최근 업데이트
- Chosen 텍스트 로그라이크 게임 추가 (URL 상태 저장)
- 스도쿠 게임 추가 (모바일 터치 패드 지원)
- 테트리스 난이도 시스템 및 가이드 추가
- AI 챗봇 추가 (Gemini API 연동)
- 테트리스 스페이스바 즉시 낙하 버그 수정
- 모바일 반응형 UI 개선
- 스크롤 제거로 게임 몰입도 향상
- Enter 키 전송 시 텍스트 잔여 문제 해결
