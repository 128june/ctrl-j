class GameLogic {
    constructor(gameState) {
        this.gameState = gameState;
    }
    
    // 시드 기반 랜덤 생성기
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    // 스탯 체크
    rollStat(stat, target) {
        const roll = Math.floor(this.seededRandom(this.gameState.state.seed + Date.now()) * 20) + 1;
        const total = this.gameState.state[stat] + roll;
        this.gameState.state.seed++; // 시드 변경으로 다음 랜덤 보장
        return total >= target;
    }
    
    // 조건 체크
    checkCondition(condition) {
        if (!condition) return true;
        
        if (condition.tags) {
            return condition.tags.every(tag => this.gameState.state.tags.includes(tag));
        }
        
        if (condition.stats) {
            return Object.entries(condition.stats).every(([stat, min]) => 
                this.gameState.state[stat] >= min
            );
        }
        
        return true;
    }
    

    
    // 선택지 처리 (새로운 데이터 구조)
    processChoice(choice) {
        console.log('선택지 처리:', choice);
        
        // 스탯 체크가 있는 경우
        if (choice.checkStat && choice.checkValue) {
            const success = this.rollStat(choice.checkStat, choice.checkValue);
            console.log(`${choice.checkStat} 체크 (목표: ${choice.checkValue}):`, success ? '성공' : '실패');
            
            if (success) {
                this.applyNewEffect(choice.success);
                if (choice.success.target) {
                    this.gameState.state.location = choice.success.target;
                }
            } else {
                this.applyNewEffect(choice.failure);
                if (choice.failure.target) {
                    this.gameState.state.location = choice.failure.target;
                }
            }
        } else {
            // 스탯 체크 없는 경우 - success 효과만 적용
            this.applyNewEffect(choice.success);
            if (choice.success.target) {
                this.gameState.state.location = choice.success.target;
            }
        }
    }
    
    // 새로운 효과 적용 시스템
    applyNewEffect(effect) {
        if (!effect) return;
        
        // HP 변화
        if (effect.hp) {
            this.gameState.state.hp += effect.hp;
            console.log(`HP 변화: ${effect.hp > 0 ? '+' : ''}${effect.hp}`);
        }
        
        // Karma 변화
        if (effect.karma) {
            this.gameState.state.karma += effect.karma;
            console.log(`Karma 변화: ${effect.karma > 0 ? '+' : ''}${effect.karma}`);
        }
        
        // Int 변화
        if (effect.int) {
            this.gameState.state.int += effect.int;
            console.log(`Int 변화: ${effect.int > 0 ? '+' : ''}${effect.int}`);
        }
        
        // 태그 추가
        if (effect.tags && effect.tags.length > 0) {
            effect.tags.forEach(tag => {
                if (!this.gameState.state.tags.includes(tag)) {
                    this.gameState.state.tags.push(tag);
                    console.log(`태그 추가: ${tag}`);
                }
            });
        }
        
        // HP 제한
        this.gameState.state.hp = Math.max(0, Math.min(30, this.gameState.state.hp));
    }
}