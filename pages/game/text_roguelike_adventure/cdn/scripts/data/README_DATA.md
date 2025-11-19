# Data Layer

데이터 관리 및 외부 소스 연동을 담당하는 모듈들

## dataManager.js

### 주요 기능
- **LocalStorage 캐싱**: 24시간 만료 시간으로 게임 데이터 캐싱
- **스프레드시트 로드**: Google Sheets에서 CSV 형태로 데이터 가져오기
- **오류 복구**: 데이터 로드 실패 시 기본 데이터 자동 생성

### 주요 메서드
- `getCachedData()`: 캐시된 데이터 확인 및 만료 검사
- `setCachedData(gameData)`: 게임 데이터를 캐시에 저장
- `loadFromSheets(sheetId)`: 스프레드시트에서 데이터 로드
- `parseSheetData(rows, gameData)`: CSV 데이터를 게임 데이터로 변환
- `parseOriginData(rows, gameData, headerMap)`: Character 데이터 파싱
- `parseEventData(rows, gameData, headerMap)`: Events 데이터 파싱 및 index 매핑
- `resolveTarget(target, indexToEventMap)`: index를 event_id로 변환
- `parseTags(tagString)`: 콤마로 구분된 태그 문자열 파싱

### 스프레드시트 구조

#### Events 시트 컴럼
| 컴럼명 | 의미 | 예시 |
|---------|------|------|
| index | 편집용 번호 | 1, 2, 3... |
| event_id | 이벤트 ID | START, go_A01 |
| event_name | 이벤트 제목 | 게임 시작 |
| event_desc | 상세 설명 | 당신의 모험이... |
| choice_id | 선택지 ID | choice_1 |
| choice_text | 선택지 텍스트 | 모험 시작 |
| check_stat | 능력치 검사 | str/dex/int |
| check_value | 능력치 기준값 | 12 |
| success_target | 성공 시 이동 | go_A02 |
| success_hp | HP 변화 | +5, -2 |
| success_karma | Karma 변화 | +1, -1 |
| success_int | Int 변화 | +1 |
| success_tags | 성공 시 태그 | HERO,BRAVE |
| failure_target | 실패 시 이동 | go_A01_fail |
| failure_hp | HP 변화 | -3 |
| failure_karma | Karma 변화 | -2 |
| failure_int | Int 변화 | 0 |
| failure_tags | 실패 시 태그 | WOUNDED |
| event_condition | 조건 | TAG:NOBLE |
| event_condition_desc | 조건 설명 | 귀족 출신만 |

### Index 기반 타겟 변환
- **기능**: success_target/failure_target에 숫자(index) 입력 시 자동으로 event_id로 변환
- **예시**: target이 "4"인 경우 → index 4의 event_id인 "A01"로 변환
- **장점**: 스프레드시트에서 행 번호로 쉽게 참조 가능

### 데이터 구조
```javascript
// 캐시 데이터
{
    gameData: { origins: {}, events: {} },
    timestamp: 1234567890
}

// 게임 데이터
{
    title: 'Text Roguelike Adventure',
    origins: { NOBLE: {...}, PAUPER: {...}, SCHOLAR: {...} },
    events: {
        START: {
            name: '시작의 방',
            desc: '당신은 어둠 속에서 깨어났습니다.',
            condition: null,
            choices: [
                {
                    id: 'A01',
                    text: '왼쪽 문으로 간다',
                    checkStat: null,
                    checkValue: null,
                    success: { target: 'A01', hp: 0, karma: 0, tags: [] },
                    failure: { target: 'A01', hp: 0, karma: 0, tags: [] }
                }
            ]
        }
    }
}
```

## sheetLoader.js

### 주요 기능
- **데이터 로드 관리**: dataManager와 연동하여 게임 데이터 로드
- **UI 업데이트**: 게임 제목 설정 및 로딩 상태 관리
- **전역 접근**: 다른 모듈에서 게임 데이터에 접근할 수 있는 인터페이스 제공

### 주요 메서드
- `loadGameData()`: 캐시 확인 후 필요시 스프레드시트에서 로드
- `setGameTitle()`: HTML 제목을 게임 데이터의 제목으로 설정

### 사용 예시
```javascript
await sheetLoader.loadGameData();
const origins = sheetLoader.gameData.origins;
const events = sheetLoader.gameData.events;
```