# UI Layer

사용자 인터페이스 렌더링을 담당하는 모듈

## gameRenderer.js

### 주요 기능
- **출신 선택 화면**: 3가지 출신 중 선택할 수 있는 UI 렌더링
- **게임 화면**: 스토리 텍스트, 플레이어 스탯, 선택지 표시
- **게임 오버 화면**: HP가 0 이하일 때 게임 종료 화면
- **이벤트 처리**: 사용자 클릭 이벤트를 게임 컨트롤러로 전달

### 주요 메서드
- `showOriginSelection()`: 출신 선택 화면 렌더링
- `updateStats()`: 플레이어 스탯 정보 업데이트
- `updateStory(location)`: 현재 위치의 스토리 텍스트 표시
- `updateChoices(location)`: 새로운 데이터 구조의 선택지 렌더링
- `createNewChoiceButton(choice, container)`: 스탯 체크 표시가 포함된 선택지 버튼 생성
- `showGameOver()`: 게임 오버 화면 표시

### 콜백 함수
- `onOriginSelect(originKey)`: 출신 선택 시 호출
- `onChoiceSelect(choice)`: 선택지 선택 시 호출

### HTML 요소 연동
```javascript
// 주요 DOM 요소들
document.getElementById('storyText')    // 스토리 텍스트 영역
document.getElementById('choices')      // 선택지 버튼 영역
document.getElementById('playerStats')  // 플레이어 스탯 표시
document.getElementById('loading')      // 로딩 화면
```

### 스탯 체크 표시
- **기능**: 선택지에 스탯 체크가 있을 경우 버튼에 표시
- **형식**: `선택지 텍스트 [STAT 값+]`
- **예시**: `몰래 물건을 훔친다 [DEX 12+]`

### 렌더링 예시
```javascript
// 출신 선택 화면
<div class="origin-selection">
    <h2>당신의 출신을 선택하세요</h2>
    <button class="choice-btn origin-btn">
        <div class="origin-name">NOBLE</div>
        <div class="origin-stats">STR: 12 | INT: 12 | DEX: 8 | KARMA: 5</div>
    </button>
</div>

// 게임 화면 (스탯 체크 포함)
<div class="story-content">
    <h2>냡은 상점</h2>
    <p>먼지가 쌓인 상점입니다. 상인이 당신을 바라보고 있습니다.</p>
</div>
<div class="choices">
    <button class="choice-btn">몰래 물건을 훔친다 [DEX 12+]</button>
    <button class="choice-btn">그냥 떠난다</button>
</div>
```

### 스타일 클래스
- `.origin-selection`: 출신 선택 화면 스타일
- `.story-content`: 스토리 텍스트 영역 스타일
- `.choices`: 선택지 버튼 영역 스타일
- `.player-stats`: 플레이어 스탯 표시 스타일
- `.game-over`: 게임 오버 화면 스타일