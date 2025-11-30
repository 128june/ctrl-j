# Core Layer

게임의 핵심 로직과 상태 관리를 담당하는 모듈들

## gameState.js

### 주요 기능
- **상태 관리**: 플레이어의 현재 게임 상태 저장 및 관리
- **URL 인코딩/디코딩**: Base64 URL Safe 방식으로 상태를 URL에 저장
- **상태 초기화**: 새 게임 시작 시 기본 상태로 리셋

### 게임 상태 구조
```javascript
{
    location: 'START',    // 현재 위치
    hp: 20,              // 체력
    str: 10,             // 힘
    int: 10,             // 지능
    dex: 10,             // 민첩
    karma: 0,            // 카르마
    tags: [],            // 게임 태그
    seed: 12345,         // 랜덤 시드
    origin: null         // 선택된 출신
}
```

### 주요 메서드
- `encodeState()`: 게임 상태를 URL Safe Base64로 인코딩
- `decodeState()`: Base64 문자열을 게임 상태로 디코딩
- `loadFromURL()`: URL 파라미터에서 게임 상태 로드
- `updateURL()`: 현재 상태를 URL에 반영
- `reset()`: 게임 상태를 초기값으로 리셋

## gameLogic.js

### 주요 기능
- **선택지 처리**: 플레이어 선택에 따른 게임 진행
- **스탯 체크**: 능력치 기반 성공/실패 판정
- **효과 적용**: 선택 결과에 따른 스탯 변화 및 태그 추가
- **조건 검사**: 태그 및 스탯 기반 조건부 분기

### 주요 메서드
- `processChoice(choice)`: 새로운 데이터 구조의 선택지 처리
- `rollStat(stat, target)`: 시드 기반 스탯 체크 (d20 + 스탯 vs 목표값)
- `applyNewEffect(effect)`: 새로운 효과 시스템 적용
- `seededRandom(seed)`: 시드 기반 랜덤 생성기

### 새로운 데이터 구조 처리
- **스탯 체크**: checkStat과 checkValue를 사용한 능력치 판정
- **성공/실패 효과**: success와 failure 객체로 분리된 결과 처리
- **태그 시스템**: 배열 형태의 태그 관리

```javascript
// 선택지 구조
{
    id: 'steal',
    text: '몰래 물건을 훔친다',
    checkStat: 'dex',
    checkValue: 12,
    success: { target: 'A02', hp: 0, karma: -2, tags: ['THIEF'] },
    failure: { target: 'A01_CAUGHT', hp: -3, karma: -1, tags: [] }
}
```

## gameController.js

### 주요 기능
- **게임 초기화**: 데이터 로드 및 UI 설정
- **게임 흐름 제어**: 출신 선택, 선택지 처리, 페이지 렌더링
- **오류 처리**: 위치 오류 시 복구 기능
- **게임 저장**: URL 기반 게임 상태 저장

### 주요 메서드
- `init()`: 게임 초기화 및 데이터 로드
- `selectOrigin(originKey)`: 출신 선택 처리
- `makeChoice(choice)`: 선택지 선택 처리
- `renderGamePage()`: 현재 상태에 맞는 페이지 렌더링
- `fixLocation()`: 위치 오류 시 START로 이동
- `newGame()`: 새 게임 시작
- `saveGame()`: 게임 상태 URL 저장

### 게임 흐름
1. 데이터 로드 → 2. 출신 선택 → 3. 스토리 진행 → 4. 선택지 선택 → 5. 결과 적용 → 3번으로 반복