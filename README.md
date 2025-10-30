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
│   ├── chatbot/       # AI 챗봇
│   │   ├── ai-chatbot.html
│   │   └── cdn/
│   │       ├── css/
│   │       └── js/
│   └── about/         # 소개 페이지
│       ├── intro.html
│       ├── profile.html
│       └── vision.html
├── config/            # 설정 파일
└── README.md
```

## 게임
- **테트리스**: `pages/game/tetris.html`
  - 조작법: 방향키로 이동/회전, 스페이스바로 즉시 낙하
  - 점수, 레벨, 라인 클리어 기능 포함
  - 모바일 반응형 지원 (터치 디바이스 최적화)
  - 스크롤 없는 풀스크린 게임 환경

## 도구
- **AI 챗봇**: `pages/chatbot/ai-chatbot.html`
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
- AI 챗봇 추가 (Gemini API 연동)
- 테트리스 스페이스바 즉시 낙하 버그 수정
- 모바일 반응형 UI 개선
- 스크롤 제거로 게임 몰입도 향상
- Enter 키 전송 시 텍스트 잔여 문제 해결
