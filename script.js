const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const targetColorDisplay = document.getElementById('target-color');
const startButton = document.getElementById('start-button');
const levelDisplay = document.getElementById('level');

let score = 0;
let lives = 5;
let level = 1;
let gameInterval;
let balloonCount = 0;
const maxBalloons = 15;
let balloonSpeed = 5;
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}


function createBalloon() {
    if (balloonCount >= maxBalloons) return;

    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    const randomColor = getRandomColor();
    balloon.style.backgroundColor = randomColor;
    balloon.style.color = randomColor;


    // ✅ Randomize size
    const randomSize = Math.random() * 20 + 40;
    balloon.style.width = `${randomSize}px`;
    balloon.style.height = `${randomSize * 1.5}px`;

    // ✅ Random X position
    const randomX = Math.random() * (window.innerWidth - randomSize);
    balloon.style.left = `${randomX}px`;

    // ✅ Randomized animation speed
    const randomSpeed = Math.random() * 2 + balloonSpeed;
    balloon.style.animationDuration = `${randomSpeed}s`;

    gameContainer.appendChild(balloon);
    balloonCount++;

    balloon.addEventListener('animationend', () => {
        balloon.remove();
        balloonCount--;
    });

    balloon.addEventListener('click', (event) => {
        event.stopPropagation();

        if (randomColor === targetColorDisplay.textContent.toLowerCase()) {
            score++;
            scoreDisplay.textContent = score;

            let star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${event.clientX}px`;
            star.style.top = `${event.clientY}px`;
            document.body.appendChild(star);
            setTimeout(() => { star.remove(); }, 1000);

            if (score % 5 === 0) {
                level++;
                levelDisplay.textContent = level;
                balloonSpeed = Math.max(2, balloonSpeed - 0.5);
                alert(`Level ${level} Unlocked! Balloons move faster!`);
            }

            let newColor;
            do {
                newColor = getRandomColor();
            } while (newColor === targetColorDisplay.textContent.toLowerCase());

            targetColorDisplay.textContent = newColor;
            targetColorDisplay.style.color = newColor;
        } else {
            lives--;
            livesDisplay.textContent = lives;
            checkGameOver();
        }

        balloon.remove();
        balloonCount--;
    });
}


//  Deduct lives when clicking anywhere on game-container
gameContainer.addEventListener('click', (event) => {
    if (!event.target.classList.contains('balloon')) {
        lives--;
        livesDisplay.textContent = lives;
        checkGameOver();
    }
});



// ✅ Extra Life Power-Up
document.getElementById("extra-life").addEventListener("click", () => {
    if (lives < 10) {
        lives++;
        livesDisplay.textContent = lives;
    }
    document.getElementById("extra-life").disabled = true;
});

// ✅ Score Boost Power-Up
document.getElementById("score-boost").addEventListener("click", () => {
    score += 5;
    scoreDisplay.textContent = score;
    document.getElementById("score-boost").disabled = true;
});

// ✅ Slow Motion Power-Up
document.getElementById("slow-motion").addEventListener("click", () => {
    balloonSpeed += 3;
    setTimeout(() => {
        balloonSpeed -= 3;
    }, 5000);
    document.getElementById("slow-motion").disabled = true;
});


function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    score = 0;
    lives = 5;
    level = 1;
    balloonCount = 0;
    balloonSpeed = 5;

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    levelDisplay.textContent = level;

    targetColorDisplay.textContent = getRandomColor();
    targetColorDisplay.style.color = targetColorDisplay.textContent;

    gameContainer.innerHTML = '';

    // ✅ Enable Power-Ups
    document.getElementById("extra-life").disabled = false;
    document.getElementById("score-boost").disabled = false;
    document.getElementById("slow-motion").disabled = false;

    gameInterval = setInterval(() => {
        createBalloon();
    }, 1000);

    startButton.disabled = true;
}


function checkGameOver() {
    if (lives === 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    alert(`Game Over! Your final score is ${score}`);
    startButton.disabled = false;
}

startButton.addEventListener('click', startGame);
