class ChosenGame {
    constructor() {
        this.gameState = this.getDefaultState();
        this.init();
    }
    
    getDefaultState() {
        return {
            location: 'START',
            hp: 20,
            str: 10,
            int: 10,
            dex: 10,
            karma: 0,
            tags: [],
            seed: Math.floor(Math.random() * 100000),
            origin: null
        };
    }
    
    // URL Safe Base64 인코딩
    encodeState(gameState) {
        try {
            const jsonString = JSON.stringify(gameState);
            const base64 = btoa(unescape(encodeURIComponent(jsonString)));
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        } catch (e) {
            console.error('인코딩 실패:', e);
            return '';
        }
    }
    
    // URL Safe Base64 디코딩
    decodeState(encodedString) {
        try {
            let base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            const jsonString = decodeURIComponent(escape(atob(base64)));
            return JSON.parse(jsonString);
        } catch (e) {
            console.error('디코딩 실패:', e);
            return this.getDefaultState();
        }
    }
    
    // 시드 기반 랜덤 생성기
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    // 스탯 체크
    rollStat(stat, target) {
        const roll = Math.floor(this.seededRandom(this.gameState.seed + Date.now()) * 20) + 1;
        const total = this.gameState[stat] + roll;
        this.gameState.seed++; // 시드 변경으로 다음 랜덤 보장
        return total >= target;
    }
    
    // 조건 체크
    checkCondition(condition) {
        if (!condition) return true;
        
        if (condition.tags) {
            return condition.tags.every(tag => this.gameState.tags.includes(tag));
        }
        
        if (condition.stats) {
            return Object.entries(condition.stats).every(([stat, min]) => 
                this.gameState[stat] >= min
            );
        }
        
        return true;
    }
    
    // 효과 적용
    applyEffect(effect) {
        if (!effect) return;
        
        Object.entries(effect).forEach(([key, value]) => {
            if (key === 'tags') {
                value.forEach(tag => {
                    if (!this.gameState.tags.includes(tag)) {
                        this.gameState.tags.push(tag);
                    }
                });
            } else if (typeof this.gameState[key] === 'number') {
                this.gameState[key] += value;
            } else {
                this.gameState[key] = value;
            }
        });
        
        // HP 제한
        this.gameState.hp = Math.max(0, Math.min(30, this.gameState.hp));
    }
    
    // 게임 페이지 렌더링
    renderGamePage() {
        if (!this.gameState.origin) {
            this.showOriginSelection();
            return;
        }
        
        if (this.gameState.hp <= 0) {
            this.showGameOver();
            return;
        }
        
        const location = GAME_DATA.locations[this.gameState.location];
        if (!location) {
            console.error('위치를 찾을 수 없음:', this.gameState.location);
            return;
        }
        
        this.updateStats();
        this.updateStory(location);
        this.updateChoices(location);
        this.updateURL();
    }
    
    showOriginSelection() {
        document.getElementById('storyText').innerHTML = `
            <h2>당신의 출신을 선택하세요</h2>
            <p>선택한 출신에 따라 초기 능력치와 성향이 결정됩니다.</p>
        `;
        
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        Object.entries(GAME_DATA.origins).forEach(([key, origin]) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `
                <strong>${origin.desc}</strong><br>
                STR: ${origin.str}, INT: ${origin.int}, DEX: ${origin.dex}, KARMA: ${origin.karma}
            `;
            btn.onclick = () => this.selectOrigin(key);
            choicesDiv.appendChild(btn);
        });
    }
    
    selectOrigin(originKey) {
        const origin = GAME_DATA.origins[originKey];
        this.gameState.origin = originKey;
        this.gameState.str = origin.str;
        this.gameState.int = origin.int;
        this.gameState.dex = origin.dex;
        this.gameState.karma = origin.karma;
        
        if (originKey === 'PAUPER') {
            this.gameState.tags.push('PAUPER');
        }
        
        this.renderGamePage();
    }
    
    updateStats() {
        document.getElementById('stats').innerHTML = `
            <div class="stat">HP: ${this.gameState.hp}/30</div>
            <div class="stat">STR: ${this.gameState.str}</div>
            <div class="stat">INT: ${this.gameState.int}</div>
            <div class="stat">DEX: ${this.gameState.dex}</div>
            <div class="stat">KARMA: ${this.gameState.karma}</div>
        `;
    }
    
    updateStory(location) {
        let storyText = `<h2>${location.name}</h2><p>${location.desc}</p>`;
        
        // 조건부 이벤트 체크
        if (location.events) {
            const validEvent = location.events.find(event => 
                this.checkCondition(event.condition)
            );
            
            if (validEvent) {
                storyText += `<p><em>${validEvent.desc}</em></p>`;
            }
        }
        
        document.getElementById('storyText').innerHTML = storyText;
    }
    
    updateChoices(location) {
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        // 조건부 이벤트 선택지
        if (location.events) {
            const validEvent = location.events.find(event => 
                this.checkCondition(event.condition)
            );
            
            if (validEvent && validEvent.choices) {
                validEvent.choices.forEach(choice => {
                    this.createChoiceButton(choice, choicesDiv);
                });
                return;
            }
        }
        
        // 일반 선택지
        location.choices.forEach(choice => {
            this.createChoiceButton(choice, choicesDiv);
        });
    }
    
    createChoiceButton(choice, container) {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.onclick = () => this.makeChoice(choice);
        container.appendChild(btn);
    }
    
    makeChoice(choice) {
        // 스탯 체크가 있는 경우
        if (choice.stat_check) {
            const [stat, target] = Object.entries(choice.stat_check)[0];
            const success = this.rollStat(stat, target);
            
            if (success && choice.success) {
                this.applyEffect(choice.success);
                if (choice.success.target) {
                    this.gameState.location = choice.success.target;
                }
            } else if (!success && choice.failure) {
                this.applyEffect(choice.failure);
                if (choice.failure.target) {
                    this.gameState.location = choice.failure.target;
                }
            }
        } else {
            // 일반 효과 적용
            if (choice.effect) {
                this.applyEffect(choice.effect);
            }
            
            if (choice.target) {
                this.gameState.location = choice.target;
            }
        }
        
        this.renderGamePage();
    }
    
    showGameOver() {
        document.getElementById('storyText').innerHTML = `
            <h2>게임 오버</h2>
            <p>당신은 쓰러졌습니다... 하지만 이것이 끝이 아닙니다.</p>
            <p>다시 시작하여 다른 선택을 해보세요.</p>
        `;
        
        document.getElementById('choices').innerHTML = '';
    }
    
    updateURL() {
        const encoded = this.encodeState(this.gameState);
        const newUrl = `${window.location.pathname}?state=${encoded}`;
        window.history.replaceState(null, '', newUrl);
    }
    
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const stateParam = params.get('state');
        
        if (stateParam) {
            this.gameState = this.decodeState(stateParam);
        }
    }
    
    newGame() {
        this.gameState = this.getDefaultState();
        window.history.replaceState(null, '', window.location.pathname);
        this.renderGamePage();
    }
    
    saveGame() {
        const encoded = this.encodeState(this.gameState);
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('게임 상태가 URL에 저장되었습니다. 현재 URL을 복사했습니다.');
        });
    }
    
    init() {
        this.loadFromURL();
        this.renderGamePage();
        
        document.getElementById('newGameBtn').onclick = () => this.newGame();
        document.getElementById('saveBtn').onclick = () => this.saveGame();
    }
}

// 게임 시작
const game = new ChosenGame();