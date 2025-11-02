class Sudoku {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.startTime = null;
        this.timerInterval = null;
        this.hintsUsed = 0;
        
        this.setupGrid();
        this.setupControls();
    }
    
    setupGrid() {
        const gridElement = document.getElementById('sudokuGrid');
        gridElement.innerHTML = '';
        
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.selectCell(i));
            gridElement.appendChild(cell);
        }
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('hintBtn').addEventListener('click', () => this.giveHint());
        document.getElementById('checkBtn').addEventListener('click', () => this.checkSolution());
        document.getElementById('difficultySelect').addEventListener('change', () => this.newGame());
        
        // 숫자 패드 이벤트
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.selectedCell) {
                    const num = parseInt(btn.dataset.number);
                    this.inputNumber(num);
                }
            });
        });
        
        document.getElementById('eraseBtn').addEventListener('click', () => {
            if (this.selectedCell) {
                this.eraseCell();
            }
        });
    }
    
    selectCell(index) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        if (this.isCellGiven(row, col)) return;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected', 'highlight');
        });
        
        this.selectedCell = { row, col, index };
        document.querySelector(`[data-index="${index}"]`).classList.add('selected');
        this.highlightRelated(row, col);
    }
    
    highlightRelated(row, col) {
        for (let i = 0; i < 9; i++) {
            document.querySelector(`[data-index="${row * 9 + i}"]`).classList.add('highlight');
            document.querySelector(`[data-index="${i * 9 + col}"]`).classList.add('highlight');
        }
        
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                document.querySelector(`[data-index="${r * 9 + c}"]`).classList.add('highlight');
            }
        }
    }
    
    handleKeyPress(e) {
        if (!this.selectedCell) return;
        
        if (e.key >= '1' && e.key <= '9') {
            const num = parseInt(e.key);
            this.inputNumber(num);
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            this.eraseCell();
        }
    }
    
    inputNumber(num) {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        this.grid[row][col] = num;
        this.updateCell(row, col, num);
        this.checkErrors();
        if (this.isComplete()) this.gameComplete();
    }
    
    eraseCell() {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        this.grid[row][col] = 0;
        this.updateCell(row, col, '');
        this.clearErrors();
    }
    
    updateCell(row, col, value) {
        const index = row * 9 + col;
        document.querySelector(`[data-index="${index}"]`).textContent = value || '';
    }
    
    isCellGiven(row, col) {
        const index = row * 9 + col;
        return document.querySelector(`[data-index="${index}"]`).classList.contains('given');
    }
    
    checkErrors() {
        document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('error'));
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] !== 0 && !this.isValidMove(row, col, this.grid[row][col])) {
                    const index = row * 9 + col;
                    document.querySelector(`[data-index="${index}"]`).classList.add('error');
                }
            }
        }
    }
    
    clearErrors() {
        document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('error'));
    }
    
    isValidMove(row, col, num) {
        const originalValue = this.grid[row][col];
        this.grid[row][col] = 0;
        
        for (let i = 0; i < 9; i++) {
            if (this.grid[row][i] === num || this.grid[i][col] === num) {
                this.grid[row][col] = originalValue;
                return false;
            }
        }
        
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (this.grid[r][c] === num) {
                    this.grid[row][col] = originalValue;
                    return false;
                }
            }
        }
        
        this.grid[row][col] = originalValue;
        return true;
    }
    
    generatePuzzle() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        this.fillGrid();
        this.solution = this.grid.map(row => [...row]);
        
        const difficulty = document.getElementById('difficultySelect').value;
        const cellsToRemove = { easy: 40, medium: 50, hard: 60 }[difficulty];
        
        for (let i = 0; i < cellsToRemove; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            } while (this.grid[row][col] === 0);
            
            this.grid[row][col] = 0;
        }
    }
    
    fillGrid() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for (let num of numbers) {
                        if (this.isValidMove(row, col, num)) {
                            this.grid[row][col] = num;
                            if (this.fillGrid()) return true;
                            this.grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    newGame() {
        this.generatePuzzle();
        this.renderGrid();
        this.startTimer();
        this.hintsUsed = 0;
        this.selectedCell = null;
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected', 'highlight', 'error');
        });
    }
    
    renderGrid() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const index = row * 9 + col;
                const cell = document.querySelector(`[data-index="${index}"]`);
                const value = this.grid[row][col];
                
                cell.textContent = value || '';
                cell.classList.remove('given');
                
                if (value !== 0) {
                    cell.classList.add('given');
                }
            }
        }
    }
    
    startTimer() {
        this.startTime = Date.now();
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
    
    giveHint() {
        if (this.hintsUsed >= 3) {
            alert('힌트는 최대 3개까지만 사용할 수 있습니다.');
            return;
        }
        
        const emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length === 0) return;
        
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const { row, col } = randomCell;
        
        this.grid[row][col] = this.solution[row][col];
        this.updateCell(row, col, this.solution[row][col]);
        
        const index = row * 9 + col;
        document.querySelector(`[data-index="${index}"]`).classList.add('given');
        
        this.hintsUsed++;
        
        if (this.isComplete()) this.gameComplete();
    }
    
    checkSolution() {
        let correct = true;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0 || this.grid[row][col] !== this.solution[row][col]) {
                    correct = false;
                    break;
                }
            }
        }
        
        if (correct) {
            alert('정답입니다! 축하합니다!');
        } else {
            alert('아직 완성되지 않았거나 오류가 있습니다.');
        }
    }
    
    isComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col] === 0) return false;
            }
        }
        return true;
    }
    
    gameComplete() {
        clearInterval(this.timerInterval);
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        alert(`축하합니다! 완성하셨습니다!\n시간: ${minutes}분 ${seconds}초\n힌트 사용: ${this.hintsUsed}개`);
    }
}

const sudoku = new Sudoku();
sudoku.newGame();