class GameRenderer {
    constructor(gameState, gameLogic) {
        this.gameState = gameState;
        this.gameLogic = gameLogic;
    }
    
    showOriginSelection() {
        console.log('출신 선택 화면 표시');
        console.log('게임 데이터:', sheetLoader.gameData);
        console.log('출신 데이터:', sheetLoader.gameData?.origins);
        
        document.getElementById('storyText').innerHTML = `
            <h2>당신의 출신을 선택하세요</h2>
            <p>선택한 출신에 따라 초기 능력치와 성향이 결정됩니다.</p>
        `;
        
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        Object.entries(sheetLoader.gameData?.origins || {}).forEach(([key, origin]) => {
            console.log('출신 버튼 생성:', key, origin);
            const btn = document.createElement('button');
            btn.className = 'choice-btn origin-btn';
            btn.innerHTML = `
                <div class="origin-name">${key}</div>
                <div class="origin-stats">STR: ${origin.str} | INT: ${origin.int} | DEX: ${origin.dex} | KARMA: ${origin.karma}</div>
            `;
            btn.onclick = () => this.onOriginSelect(key);
            choicesDiv.appendChild(btn);
        });
    }
    
    updateStats() {
        document.getElementById('stats').innerHTML = `
            <div class="stat">HP: ${this.gameState.state.hp}/30</div>
            <div class="stat">STR: ${this.gameState.state.str}</div>
            <div class="stat">INT: ${this.gameState.state.int}</div>
            <div class="stat">DEX: ${this.gameState.state.dex}</div>
            <div class="stat">KARMA: ${this.gameState.state.karma}</div>
        `;
    }
    
    updateStory(location) {
        let storyText = `<h2>${location.name}</h2><p>${location.desc}</p>`;
        
        // 조건 체크 및 설명 추가
        if (location.condition) {
            storyText += `<p class="condition-desc"><em>${location.conditionDesc || ''}</em></p>`;
        }
        
        document.getElementById('storyText').innerHTML = storyText;
    }
    
    updateChoices(location) {
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        // 새로운 데이터 구조에 맞는 선택지 렌더링
        if (location.choices && location.choices.length > 0) {
            location.choices.forEach(choice => {
                this.createNewChoiceButton(choice, choicesDiv);
            });
        }
    }
    
    createNewChoiceButton(choice, container) {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        
        let buttonText = choice.text;
        
        // 스탯 체크가 있는 경우 표시
        if (choice.checkStat && choice.checkValue) {
            const statName = {
                'str': 'STR',
                'int': 'INT', 
                'dex': 'DEX'
            }[choice.checkStat] || choice.checkStat.toUpperCase();
            
            buttonText += ` [${statName} ${choice.checkValue}+]`;
        }
        
        btn.textContent = buttonText;
        btn.onclick = () => this.onChoiceSelect(choice);
        container.appendChild(btn);
    }
    
    showGameOver() {
        document.getElementById('storyText').innerHTML = `
            <h2>게임 오버</h2>
            <p>당신은 쓰러졌습니다... 하지만 이것이 끝이 아닙니다.</p>
            <p>다시 시작하여 다른 선택을 해보세요.</p>
        `;
        
        document.getElementById('choices').innerHTML = '';
    }
    
    // 콜백 함수들 (GameController에서 설정)
    onOriginSelect(originKey) {
        // GameController에서 구현
    }
    
    onChoiceSelect(choice) {
        // GameController에서 구현
    }
}