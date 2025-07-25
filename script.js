const board = document.querySelector('.game-board');
const winMessage = document.getElementById('winMessage');
const restartBtn = document.getElementById('restartBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const levelDisplay = document.getElementById('level');
const winLevelDisplay = document.getElementById('winLevel');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

// ✅ Sounds
const bgMusic = new Audio("sounds/bg-music.mp3");
const clickSound = new Audio("sounds/click.mp3");
const matchSound = new Audio("sounds/match.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.2;

// ✅ Level configs with time (less time for harder levels)
const levelConfigs = [
    { grid: 4, pairs: 8, time: 180 },  // Level 1: 3 minutes
    { grid: 4, pairs: 10, time: 150 }, // Level 2: 2.5 minutes
    { grid: 5, pairs: 12, time: 120 }, // Level 3: 2 minutes
    { grid: 6, pairs: 15, time: 90 },  // Level 4: 1.5 minutes
    { grid: 6, pairs: 18, time: 60 }   // Level 5: 1 minute
];


const allIcons = ["🍎","🍌","🍓","🍇","🍍","🥝","🍑","🍒","🥥","🥕","🌽","🍉","🍔","🍕","🥨","🍩","🍪","🍫"];

let flippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchedCount = 0;
let currentLevel = 1;
let score = 0;
let timer;
let timeLeft;

function startGame(level = 1) {
    currentLevel = level;
    levelDisplay.textContent = level;
    winMessage.style.display = "none";
    board.innerHTML = "";
    matchedCount = 0;

    const config = levelConfigs[level - 1];
    const gridSize = config.grid;
    const pairs = config.pairs;
    timeLeft = config.time;
    timerDisplay.textContent = timeLeft;
    scoreDisplay.textContent = score;

    clearInterval(timer);
    startTimer();

    let chosenIcons = allIcons.slice(0, pairs);
    let cardsArray = [...chosenIcons, ...chosenIcons];

    cardsArray.sort(() => 0.5 - Math.random());
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

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

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("⏳ Time's up! Try again.");
            startGame(currentLevel); // Restart level
        }
    }, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    clickSound.play();
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
    matchSound.play();
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedCount += 2;
    score += 10; // ✅ Add 10 points for each match
    scoreDisplay.textContent = score;

    const config = levelConfigs[currentLevel - 1];
    if (matchedCount === config.pairs * 2) {
        clearInterval(timer);
        score += timeLeft * 2; // ✅ Bonus for remaining time
        scoreDisplay.textContent = score;
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
    nextLevelBtn.style.display = currentLevel === 5 ? "none" : "inline-block";
}

restartBtn.addEventListener('click', () => startGame(currentLevel));
nextLevelBtn.addEventListener('click', () => {
    if (currentLevel < 5) {
        startGame(currentLevel + 1);
    }
});

document.addEventListener("click", () => {
    bgMusic.play().catch(() => {});
}, { once: true });

startGame(1);
