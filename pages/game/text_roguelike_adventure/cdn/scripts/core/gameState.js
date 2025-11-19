class GameState {
    constructor() {
        this.state = this.getDefaultState();
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
    encodeState(gameState = this.state) {
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
    
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const stateParam = params.get('state');
        
        if (stateParam) {
            this.state = this.decodeState(stateParam);
        }
    }
    
    updateURL() {
        const encoded = this.encodeState();
        const newUrl = `${window.location.pathname}?state=${encoded}`;
        window.history.replaceState(null, '', newUrl);
    }
    
    reset() {
        this.state = this.getDefaultState();
        window.history.replaceState(null, '', window.location.pathname);
    }
}