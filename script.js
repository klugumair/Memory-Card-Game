const board = document.querySelector('.game-board');
const winMessage = document.getElementById('winMessage');
const restartBtn = document.getElementById('restartBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const levelDisplay = document.getElementById('level');
const winLevelDisplay = document.getElementById('winLevel');

// ✅ Sounds
const bgMusic = new Audio("sounds/bg-music.mp3");
const clickSound = new Audio("sounds/click.mp3");
const matchSound = new Audio("sounds/match.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.2;

// ✅ Different levels with grid sizes & icons
const levelConfigs = [
    { grid: 4, pairs: 8 },  // Level 1 (4x4)
    { grid: 4, pairs: 10 }, // Level 2 (4x5)
    { grid: 5, pairs: 12 }, // Level 3 (5x5)
    { grid: 6, pairs: 15 }, // Level 4 (6x5)
    { grid: 6, pairs: 18 }  // Level 5 (6x6)
];

// Some random emojis to use
const allIcons = ["🍎","🍌","🍓","🍇","🍍","🥝","🍑","🍒","🥥","🥕","🌽","🍉","🍔","🍕","🥨","🍩","🍪","🍫"];

let flippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchedCount = 0;
let currentLevel = 1;

function startGame(level = 1) {
    currentLevel = level;
    levelDisplay.textContent = level;
    winMessage.style.display = "none";
    board.innerHTML = "";
    matchedCount = 0;

    // Get level config
    const config = levelConfigs[level - 1];
    const gridSize = config.grid;
    const pairs = config.pairs;

    let chosenIcons = allIcons.slice(0, pairs);
    let cardsArray = [...chosenIcons, ...chosenIcons];

    // Shuffle cards
    cardsArray.sort(() => 0.5 - Math.random());

    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;


    // Create cards
    cardsArray.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${icon}</div>
        `;
        board.appendChild(card);
    });

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', flipCard);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    clickSound.play(); // ✅ Play on every click
    this.classList.add('flip');

    if (!flippedCard) {
        flippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.innerHTML === secondCard.innerHTML;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    matchSound.play(); // ✅ Play excited sound when matched
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedCount += 2;
    const config = levelConfigs[currentLevel - 1];

    if (matchedCount === config.pairs * 2) {
        setTimeout(showWinMessage, 500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [flippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function showWinMessage() {
    winLevelDisplay.textContent = currentLevel;
    winMessage.style.display = "block";

    // Hide next level if on level 5
    nextLevelBtn.style.display = currentLevel === 5 ? "none" : "inline-block";
}

// ✅ Buttons
restartBtn.addEventListener('click', () => startGame(currentLevel));
nextLevelBtn.addEventListener('click', () => {
    if (currentLevel < 5) {
        startGame(currentLevel + 1);
    }
});

// ✅ Start background music on first click (autoplay fix)
document.addEventListener("click", () => {
    bgMusic.play().catch(() => {});
}, { once: true });

// Start the first level
startGame(1);
