class Tetris {
    constructor() {
        this.canvas = document.getElementById('tetris');
        this.ctx = this.canvas.getContext('2d');
        this.grid = this.createGrid(12, 20);
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.paused = false;
        this.gameOver = false;
        
        this.colors = [
            null,
            '#FF0D72', '#0DC2FF', '#0DFF72',
            '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
        ];
        
        this.pieces = 'TJLOSZI';
        this.player = {
            pos: {x: 0, y: 0},
            matrix: null,
        };
        
        this.setupControls();
        this.updateScore();
    }
    
    createGrid(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }
    
    createPiece(type) {
        if (type === 'T') {
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        } else if (type === 'O') {
            return [
                [2, 2],
                [2, 2],
            ];
        } else if (type === 'L') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3],
            ];
        } else if (type === 'J') {
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0],
            ];
        } else if (type === 'I') {
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'Z') {
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0],
            ];
        }
    }
    
    collide(grid, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (grid[y + o.y] &&
                    grid[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }
    
    merge(grid, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    grid[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }
    
    rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
            }
        }
        
        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }
    
    playerDrop() {
        this.player.pos.y++;
        if (this.collide(this.grid, this.player)) {
            this.player.pos.y--;
            this.merge(this.grid, this.player);
            this.playerReset();
            this.gridSweep();
            this.updateScore();
        }
        this.dropTime = 0;
    }
    
    playerMove(offset) {
        this.player.pos.x += offset;
        if (this.collide(this.grid, this.player)) {
            this.player.pos.x -= offset;
        }
    }
    
    playerReset() {
        const pieces = 'TJLOSZI';
        this.player.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]);
        this.player.pos.y = 0;
        this.player.pos.x = (this.grid[0].length / 2 | 0) -
                           (this.player.matrix[0].length / 2 | 0);
        if (this.collide(this.grid, this.player)) {
            this.gameOver = true;
            alert('게임 오버!');
        }
    }
    
    playerRotate(dir) {
        const pos = this.player.pos.x;
        let offset = 1;
        this.rotate(this.player.matrix, dir);
        while (this.collide(this.grid, this.player)) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix[0].length) {
                this.rotate(this.player.matrix, -dir);
                this.player.pos.x = pos;
                return;
            }
        }
    }
    
    gridSweep() {
        let rowCount = 1;
        outer: for (let y = this.grid.length -1; y > 0; --y) {
            for (let x = 0; x < this.grid[y].length; ++x) {
                if (this.grid[y][x] === 0) {
                    continue outer;
                }
            }
            
            const row = this.grid.splice(y, 1)[0].fill(0);
            this.grid.unshift(row);
            ++y;
            
            this.lines += rowCount;
            this.score += rowCount * 10 * this.level;
            rowCount *= 2;
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawMatrix(this.grid, {x: 0, y: 0});
        this.drawMatrix(this.player.matrix, this.player.pos);
    }
    
    drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.ctx.fillStyle = this.colors[value];
                    this.ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }
    
    update(time = 0) {
        if (this.gameOver || this.paused) return;
        
        const deltaTime = time - this.lastTime;
        
        this.dropTime += deltaTime;
        if (this.dropTime > this.dropInterval) {
            this.playerDrop();
        }
        
        this.lastTime = time;
        
        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }
    
    updateScore() {
        document.getElementById('score').innerText = this.score;
        document.getElementById('level').innerText = this.level;
        document.getElementById('lines').innerText = this.lines;
    }
    
    setupControls() {
        document.addEventListener('keydown', event => {
            if (event.keyCode === 37) {
                this.playerMove(-1);
            } else if (event.keyCode === 39) {
                this.playerMove(1);
            } else if (event.keyCode === 40) {
                this.playerDrop();
            } else if (event.keyCode === 38) {
                this.playerRotate(1);
            } else if (event.keyCode === 32) {
                while (!this.collide(this.grid, this.player)) {
                    this.player.pos.y++;
                }
                this.player.pos.y--;
                this.playerDrop();
            }
        });
        
        document.getElementById('startBtn').addEventListener('click', () => {
            this.start();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pause();
        });
    }
    
    start() {
        this.gameOver = false;
        this.paused = false;
        this.grid = this.createGrid(12, 20);
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.playerReset();
        this.updateScore();
        this.update();
    }
    
    pause() {
        this.paused = !this.paused;
        if (!this.paused) {
            this.update();
        }
    }
}

// 게임 초기화
const tetris = new Tetris();
tetris.ctx.scale(25, 30);
tetris.playerReset();
tetris.updateScore();
tetris.draw();