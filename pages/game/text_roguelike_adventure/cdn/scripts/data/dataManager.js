class DataManager {
    constructor() {
        this.cacheKey = 'roguelike_game_data';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24시간
    }
    
    // 캐시된 데이터 확인
    getCachedData() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            const now = Date.now();
            
            if (now - data.timestamp > this.cacheExpiry) {
                localStorage.removeItem(this.cacheKey);
                return null;
            }
            
            return data.gameData;
        } catch (e) {
            console.error('캐시 데이터 로드 실패:', e);
            return null;
        }
    }
    
    // 데이터 캐시에 저장
    setCachedData(gameData) {
        try {
            const cacheData = {
                gameData,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (e) {
            console.error('캐시 데이터 저장 실패:', e);
        }
    }
    
    // 스프레드시트에서 데이터 로드 (첫 번째 시트만 사용)
    async loadFromSheets(sheetId) {
        // 스프레드시트 제목 가져오기
        const sheetTitle = await this.fetchSheetTitle(sheetId);
        
        const gameData = {
            title: sheetTitle || 'Text Roguelike Adventure',
            origins: {},
            events: {},
            backgrounds: []
        };
        
        let sheetsLoaded = 0;
        
        // Events 시트 (gid=265052090) 직접 로드
        try {
            const csvText = await this.fetchSheet(sheetId, 265052090);
            const rows = this.parseCSV(csvText);
            console.log('Events 시트 데이터:', rows);
            this.parseSheetData(rows, gameData);
            sheetsLoaded++;
        } catch (e) {
            console.error('Events 시트 로드 실패:', e);
        }
        
        // Character 시트 (gid=0) 로드
        try {
            const csvText = await this.fetchSheet(sheetId, 0);
            const rows = this.parseCSV(csvText);
            console.log('Character 시트 데이터:', rows);
            this.parseSheetData(rows, gameData);
            sheetsLoaded++;
        } catch (e) {
            console.error('Character 시트 로드 실패:', e);
        }
        
        // 모든 시트 로드 실패 시 로컬 백업 데이터 사용
        if (sheetsLoaded === 0) {
            console.warn('Google Sheets 로드 실패, 로컬 백업 데이터 사용');
            return this.getLocalBackupData();
        }
        
        console.log('Origins 개수:', Object.keys(gameData.origins).length);
        console.log('Events 개수:', Object.keys(gameData.events).length);
        console.log('Events 목록:', Object.keys(gameData.events));

        console.log('최종 게임 데이터:', gameData);
        return gameData;
    }
    
    // 로컬 백업 데이터 반환
    getLocalBackupData() {
        return {
            title: 'Text Roguelike Adventure',
            origins: {
                '귀족': { desc: '부유한 가문 출신', str: 8, int: 12, dex: 10, karma: 5 },
                '빈민': { desc: '가난한 서민 출신', str: 12, int: 8, dex: 10, karma: -2 },
                '학자': { desc: '지식을 추구하는 학자', str: 8, int: 14, dex: 8, karma: 0 }
            },
            events: {
                'start': {
                    name: '모험의 시작',
                    desc: '당신은 새로운 모험을 시작합니다.',
                    choices: [
                        {
                            id: 'explore',
                            text: '탐험하기',
                            success: { target: 'forest', hp: 0, karma: 1, int: 0, tags: [] },
                            failure: { target: 'forest', hp: 0, karma: 0, int: 0, tags: [] }
                        }
                    ]
                },
                'forest': {
                    name: '숲 속에서',
                    desc: '깊은 숲에서 길을 잃었습니다.',
                    choices: [
                        {
                            id: 'search',
                            text: '길 찾기',
                            checkStat: 'int',
                            checkValue: 10,
                            success: { target: 'village', hp: 0, karma: 0, int: 1, tags: [] },
                            failure: { target: 'lost', hp: -5, karma: 0, int: 0, tags: [] }
                        }
                    ]
                }
            },
            backgrounds: []
        };
    }
    
    parseSheetData(rows, gameData) {
        if (!rows || rows.length < 2) return;
        
        const headers = rows[0].map(h => h.toLowerCase());
        console.log('시트 헤더:', headers);
        
        // 헤더 인덱스 매핑
        const headerMap = {};
        headers.forEach((header, index) => {
            headerMap[header] = index;
        });
        
        // Character 데이터인지 Events 데이터인지 판단
        if (headers.includes('str') || headers.includes('int') || headers.includes('dex')) {
            this.parseOriginData(rows, gameData, headerMap);
        } else if (headers.includes('event_id') || headers.includes('event_name')) {
            this.parseEventData(rows, gameData, headerMap);
        }
    }
    
    parseOriginData(rows, gameData, headerMap) {
        rows.slice(1).forEach(row => {
            if (!row[0]) return;
            
            gameData.origins[row[0]] = {
                desc: row[headerMap['desc'] || headerMap['description'] || 1] || row[0],
                str: parseInt(row[headerMap['str']]) || 10,
                int: parseInt(row[headerMap['int']]) || 10,
                dex: parseInt(row[headerMap['dex']]) || 10,
                karma: parseInt(row[headerMap['karma']]) || 0
            };
        });
    }
    
    parseEventData(rows, gameData, headerMap) {
        const eventGroups = {};
        const indexToEventMap = {}; // index -> event_id 매핑
        
        // 먼저 index -> event_id 매핑 생성
        rows.slice(1).forEach(row => {
            const index = row[headerMap['index']];
            const eventId = row[headerMap['event_id']];
            if (index && eventId) {
                indexToEventMap[index] = eventId;
            }
        });
        
        // 이벤트별로 그룹화
        rows.slice(1).forEach(row => {
            const eventId = row[headerMap['event_id']];
            if (!eventId) return;
            
            if (!eventGroups[eventId]) {
                eventGroups[eventId] = {
                    name: row[headerMap['event_name']] || eventId,
                    desc: row[headerMap['event_desc']] || '',
                    condition: row[headerMap['event_condition']] || null,
                    conditionDesc: row[headerMap['event_condition_desc']] || null,
                    choices: []
                };
            }
            
            // 선택지 추가
            const choiceId = row[headerMap['choice_id']];
            const choiceText = row[headerMap['choice_text']];
            
            if (choiceId && choiceText) {
                const choice = {
                    id: choiceId,
                    text: choiceText,
                    checkStat: row[headerMap['check_stat']] || null,
                    checkValue: parseInt(row[headerMap['check_value']]) || null,
                    success: {
                        target: this.resolveTarget(row[headerMap['success_target']], indexToEventMap),
                        hp: parseInt(row[headerMap['success_hp']]) || 0,
                        karma: parseInt(row[headerMap['success_karma']]) || 0,
                        int: parseInt(row[headerMap['success_int']]) || 0,
                        tags: this.parseTags(row[headerMap['success_tags']])
                    },
                    failure: {
                        target: this.resolveTarget(row[headerMap['failure_target']], indexToEventMap),
                        hp: parseInt(row[headerMap['failure_hp']]) || 0,
                        karma: parseInt(row[headerMap['failure_karma']]) || 0,
                        int: parseInt(row[headerMap['failure_int']]) || 0,
                        tags: this.parseTags(row[headerMap['failure_tags']])
                    }
                };
                
                eventGroups[eventId].choices.push(choice);
            }
        });
        
        // gameData.events에 추가
        Object.assign(gameData.events, eventGroups);
    }
    
    resolveTarget(target, indexToEventMap) {
        if (!target) return null;
        
        // 숫자인 경우 index로 간주하고 event_id로 변환
        if (!isNaN(parseInt(target))) {
            return indexToEventMap[target] || target;
        }
        
        // 문자열인 경우 그대로 사용
        return target;
    }
    
    parseTags(tagString) {
        if (!tagString) return [];
        return tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    async fetchSheet(sheetId, gid) {
        // CORS 문제 해결을 위한 여러 방법 시도
        const urls = [
            // 1. 원본 URL (CORS 허용된 도메인에서만 작동)
            `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
            // 2. CORS 프록시 사용
            `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`)}`,
            // 3. 다른 CORS 프록시
            `https://corsproxy.io/?${encodeURIComponent(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`)}`
        ];
        
        for (const url of urls) {
            try {
                console.log(`시도 중: ${url}`);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const text = await response.text();
                console.log(`성공: ${url}`);
                return text;
            } catch (error) {
                console.warn(`실패: ${url}`, error.message);
                continue;
            }
        }
        
        throw new Error('모든 URL에서 데이터 로드 실패');
    }
    
    parseCSV(csvText) {
        return csvText.split('\n').map(row => 
            row.split(',').map(cell => cell.replace(/"/g, '').trim())
        ).filter(row => row.some(cell => cell));
    }
    
    async fetchSheetTitle(sheetId) {
        try {
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
            const response = await fetch(url);
            const html = await response.text();
            
            // HTML에서 제목 추출
            const titleMatch = html.match(/<title>([^<]+)<\/title>/);
            if (titleMatch && titleMatch[1]) {
                // "제목 - Google Sheets" 형태에서 제목만 추출
                const title = titleMatch[1].replace(/ - Google (Sheets|스프레드시트)$/, '');
                console.log('스프레드시트 제목:', title);
                return title;
            }
        } catch (e) {
            console.error('스프레드시트 제목 가져오기 실패:', e);
        }
        return null;
    }
}