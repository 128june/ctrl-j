class SheetLoader {
    constructor(sheetId) {
        this.sheetId = sheetId;
        this.gameData = null;
        this.gameTitle = '';
        this.dataManager = new DataManager();
    }

    async loadGameData() {
        console.log('게임 데이터 로드 시도...');
        
        // 캐시 강제 삭제 (스프레드시트 공개 후 한 번)
        localStorage.removeItem('roguelike_game_data');
        console.log('캐시 삭제됨 - 스프레드시트에서 새로 로드');
        
        try {
            // 스프레드시트에서 로드
            this.gameData = await this.dataManager.loadFromSheets(this.sheetId);
            this.gameTitle = this.gameData.title;
            
            // 캐시에 저장
            this.dataManager.setCachedData(this.gameData);
            
            console.log('스프레드시트에서 로드 완료:', this.gameData);
        } catch (error) {
            console.error('스프레드시트 로드 실패:', error);
            throw error;
        }
        
        return this.gameData;
    }
    




    // 캐시 강제 새로고침
    clearCache() {
        this.dataManager.setCachedData(null);
        localStorage.removeItem('roguelike_game_data');
        console.log('캐시 삭제됨');
    }

    setGameTitle() {
        const titleElement = document.getElementById('gameTitle');
        if (titleElement && this.gameTitle) {
            titleElement.textContent = this.gameTitle;
        }
    }
}

// 전역 인스턴스
const sheetLoader = new SheetLoader('1BBBQ4HX8R2nnWijTO-k8YYKd1WPjShXf2Q3vA4cC7Ig');