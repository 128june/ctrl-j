# Text Roguelike Adventure

URL 기반 상태 저장을 지원하는 텍스트 로그라이크 RPG 게임

## 프로젝트 구조

```
text_roguelike_adventure/
├── index.html              # 메인 게임 페이지
├── cdn/                    # 리소스 파일들
│   ├── styles/            # CSS 스타일시트
│   │   ├── layout/        # 레이아웃 관련
│   │   │   ├── base.css
│   │   │   ├── header.css
│   │   │   └── footer.css
│   │   ├── components/    # UI 컴포넌트
│   │   │   ├── story.css
│   │   │   ├── choices.css
│   │   │   └── loading.css
│   │   └── utils/         # 유틸리티
│   │       └── responsive.css
│   └── scripts/           # JavaScript 파일들
│       ├── data/          # 데이터 관리
│       │   ├── dataManager.js
│       │   ├── sheetLoader.js
│       │   └── README_DATA.md
│       ├── core/          # 핵심 게임 로직
│       │   ├── gameState.js
│       │   ├── gameLogic.js
│       │   ├── gameController.js
│       │   └── README_CORE.md
│       └── ui/            # UI 렌더링
│           ├── gameRenderer.js
│           └── README_UI.md
└── README.md              # 이 파일
```

## 주요 기능

### 게임 시스템
- **출신 선택**: 3가지 출신 (귀족, 빈민, 학자)
- **스탯 시스템**: HP, STR, INT, DEX, KARMA
- **선택지 기반 진행**: 플레이어 선택에 따른 분기
- **스탯 체크**: 능력치 기반 성공/실패 판정

### 기술적 특징
- **URL 상태 저장**: Base64 인코딩으로 게임 상태를 URL에 저장
- **LocalStorage 캐싱**: 스프레드시트 데이터 24시간 캐싱
- **모듈화 구조**: 기능별 파일 분리
- **반응형 디자인**: 모바일 지원

## 파일 설명

### Data Layer ([상세 문서](cdn/scripts/data/README_DATA.md))
- **dataManager.js**: LocalStorage 캐싱 및 스프레드시트 로드
- **sheetLoader.js**: Google Sheets 데이터 로드 관리

### Core Layer ([상세 문서](cdn/scripts/core/README_CORE.md))
- **gameState.js**: 게임 상태 관리 및 URL 인코딩/디코딩
- **gameLogic.js**: 게임 로직 (스탯 체크, 조건 체크, 효과 적용)
- **gameController.js**: 메인 게임 컨트롤러

### UI Layer ([상세 문서](cdn/scripts/ui/README_UI.md))
- **gameRenderer.js**: UI 렌더링 (출신 선택, 스토리, 선택지)

### Styles
- **layout/**: 기본 레이아웃 (base, header, footer)
- **components/**: UI 컴포넌트 (story, choices, loading)
- **utils/**: 유틸리티 (responsive)

## 게임 플레이

1. **출신 선택**: 초기 능력치 결정
2. **스토리 진행**: 텍스트 기반 이벤트
3. **선택지 선택**: 플레이어 결정
4. **결과 적용**: 스탯 변화 및 다음 이벤트로 이동
5. **URL 저장**: 게임 상태 자동 저장

## 데이터 구조

### 게임 상태
```javascript
{
    location: 'START',
    hp: 20,
    str: 10,
    int: 10,
    dex: 10,
    karma: 0,
    tags: [],
    seed: 12345,
    origin: 'NOBLE'
}
```

### 출신 데이터
```javascript
{
    'NOBLE': { desc: '귀족 출신', str: 12, int: 12, dex: 8, karma: 5 },
    'PAUPER': { desc: '빈민 출신', str: 8, int: 8, dex: 12, karma: -5 },
    'SCHOLAR': { desc: '학자 출신', str: 8, int: 15, dex: 10, karma: 0 }
}
```

## 오류 처리

### 위치 오류 해결
- **문제**: "위치를 찾을 수 없음" 오류 발생 시
- **해결**: 오류 화면에서 "START로 이동" 버튼 클릭
- **원인**: 스프레드시트 데이터 로드 실패 또는 잘못된 위치 참조
- **예방**: 기본 게임 데이터 자동 생성으로 게임 중단 방지

### 데이터 로드 실패 대응
- **스프레드시트 연결 실패 시**: 기본 출신 데이터 및 이벤트 자동 생성
- **캐시 만료**: 24시간 후 자동으로 새 데이터 로드 시도
- **네트워크 오류**: LocalStorage 캐시 데이터 우선 사용

## 개발 정보

- **언어**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **데이터 소스**: Google Sheets (오프라인 기본 데이터 포함)
- **저장 방식**: URL Base64 인코딩 + LocalStorage 캐싱
- **스타일**: CSS Grid, Flexbox
- **반응형**: Mobile-first 디자인
- **오류 복구**: 자동 기본 데이터 생성 및 위치 수정 기능