class GameController {
    constructor() {
        this.gameState = new GameState();
        this.gameLogic = new GameLogic(this.gameState);
        this.gameRenderer = new GameRenderer(this.gameState, this.gameLogic);
        
        // 렌더러 콜백 설정
        this.gameRenderer.onOriginSelect = (originKey) => this.selectOrigin(originKey);
        this.gameRenderer.onChoiceSelect = (choice) => this.makeChoice(choice);
        
        this.init();
    }
    
    selectOrigin(originKey) {
        console.log('출신 선택됨:', originKey);
        const origin = sheetLoader.gameData?.origins[originKey];
        console.log('선택된 출신 데이터:', origin);
        
        this.gameState.state.origin = originKey;
        this.gameState.state.str = origin.str;
        this.gameState.state.int = origin.int;
        this.gameState.state.dex = origin.dex;
        this.gameState.state.karma = origin.karma;
        
        if (originKey === 'PAUPER') {
            this.gameState.state.tags.push('PAUPER');
        }
        
        console.log('업데이트된 게임 상태:', this.gameState.state);
        this.renderGamePage();
    }
    
    makeChoice(choice) {
        this.gameLogic.processChoice(choice);
        this.renderGamePage();
    }
    
    renderGamePage() {
        console.log('게임 페이지 렌더링 시작');
        console.log('현재 게임 상태:', this.gameState.state);
        
        if (!this.gameState.state.origin) {
            console.log('출신이 선택되지 않음, 출신 선택 화면 표시');
            this.gameRenderer.showOriginSelection();
            return;
        }
        
        if (this.gameState.state.hp <= 0) {
            console.log('HP가 0 이하, 게임 오버');
            this.gameRenderer.showGameOver();
            return;
        }
        
        console.log('현재 위치:', this.gameState.state.location);
        console.log('이벤트 데이터:', sheetLoader.gameData?.events);
        const location = sheetLoader.gameData?.events[this.gameState.state.location];
        if (!location) {
            console.error('위치를 찾을 수 없음:', this.gameState.state.location);
            console.error('사용 가능한 이벤트:', Object.keys(sheetLoader.gameData?.events || {}));
            
            // 사용자에게 오류 표시
            document.getElementById('storyText').innerHTML = `
                <h2>오류: 위치를 찾을 수 없음</h2>
                <p>현재 위치: <strong>${this.gameState.state.location}</strong></p>
                <p>사용 가능한 위치들:</p>
                <ul>
                    ${Object.keys(sheetLoader.gameData?.events || {}).map(key => `<li>${key}</li>`).join('')}
                </ul>
                <button onclick="game.fixLocation()">START로 이동</button>
            `;
            document.getElementById('choices').innerHTML = '';
            return;
        }
        
        console.log('현재 위치 데이터:', location);
        this.gameRenderer.updateStats();
        this.gameRenderer.updateStory(location);
        this.gameRenderer.updateChoices(location);
        this.gameState.updateURL();
    }
    
    newGame() {
        this.gameState.reset();
        this.renderGamePage();
    }
    
    saveGame() {
        const encoded = this.gameState.encodeState();
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('게임 상태가 URL에 저장되었습니다. 현재 URL을 복사했습니다.');
        });
    }
    
    fixLocation() {
        console.log('위치 수정: START로 이동');
        this.gameState.state.location = 'START';
        this.renderGamePage();
    }
    
    async init() {
        try {
            console.log('게임 초기화 시작');
            await sheetLoader.loadGameData();
            console.log('게임 데이터 로드 완료:', sheetLoader.gameData);
            sheetLoader.setGameTitle();
            
            // 로딩 화면 숨기고 게임 화면 표시
            document.getElementById('loading').style.display = 'none';
            document.getElementById('storyText').style.display = 'block';
            document.getElementById('choices').style.display = 'block';
            
            this.gameState.loadFromURL();
            console.log('URL에서 로드된 상태:', this.gameState.state);
            this.renderGamePage();
            
            document.getElementById('newGameBtn').onclick = () => this.newGame();
            document.getElementById('saveBtn').onclick = () => this.saveGame();
        } catch (error) {
            console.error('게임 초기화 실패:', error);
            document.getElementById('loading').innerHTML = '<h2>데이터 로드 실패</h2><p>다시 시도해주세요.</p>';
        }
    }
}

// 게임 시작
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new GameController();
});