const gameState = {
    inventory: [],
    puzzlesSolved: {
        lockBox: false
    },
    answers: {
        lockBox: "1228"
    },
    selectedItem: null
};

function initGame() {
    console.log("Game Initialized");
    renderInventory();
}

function openPuzzle(puzzleId) {
    if (puzzleId === 'lockBox') {
        if (gameState.puzzlesSolved.lockBox) {
            showMessage("It's already unlocked.");
        } else {
            document.getElementById('modal-overlay').classList.remove('hidden');
            document.getElementById('puzzle-lock').classList.remove('hidden');
            document.getElementById('lock-input').value = '';
            document.getElementById('lock-input').focus();
        }
    }
}

function showHint() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('view-hint').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => modal.classList.add('hidden'));
}

function checkAnswer(puzzleId) {
    const input = document.getElementById('lock-input').value;
    if (input === gameState.answers[puzzleId]) {
        gameState.puzzlesSolved[puzzleId] = true;
        closeModal();
        showMessage("Click! The lock opens.");

        // Reward: Key
        setTimeout(() => {
            showItemFound('key', 'A rusty old key.');
            addItem('key');
        }, 500);
    } else {
        showMessage("Nothing happened.");
        document.getElementById('lock-input').classList.add('shake'); // Optional visual cue
        setTimeout(() => document.getElementById('lock-input').classList.remove('shake'), 500);
    }
}

function showItemFound(itemKey, description) {
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('item-found').classList.remove('hidden');
    document.getElementById('found-title').innerText = "You found an item!";
    document.getElementById('found-image').src = `assets/${itemKey}.png`;
    document.getElementById('found-desc').innerText = description;
}

function addItem(itemName) {
    if (!gameState.inventory.includes(itemName)) {
        gameState.inventory.push(itemName);
        renderInventory();
    }
}

function renderInventory() {
    const slots = document.getElementById('inventory-slots');
    slots.innerHTML = '';
    gameState.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        if (gameState.selectedItem === item) {
            div.classList.add('selected');
        }
        div.onclick = () => selectItem(item);

        const img = document.createElement('img');
        img.src = `assets/${item}.png`;
        div.appendChild(img);
        slots.appendChild(div);
    });
}

function selectItem(itemName) {
    if (gameState.selectedItem === itemName) {
        gameState.selectedItem = null; // Deselect
    } else {
        gameState.selectedItem = itemName;
    }
    renderInventory();
}

function tryExit() {
    if (gameState.selectedItem === 'key') {
        showMessage("The key fits! The door unlocks.");
        setTimeout(() => {
            document.getElementById('success-screen').classList.remove('hidden');
        }, 1000);
    } else {
        showMessage("The door is locked.");
    }
}

function showMessage(msg) {
    const area = document.getElementById('message-area');
    area.innerText = msg;
    area.classList.remove('hidden');

    // Reset animation
    area.style.animation = 'none';
    area.offsetHeight; /* trigger reflow */
    area.style.animation = 'fadeInOut 3s forwards';

    setTimeout(() => {
        area.classList.add('hidden');
    }, 3000);
}

// Start the game
window.onload = initGame;
