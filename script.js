// script.js

document.addEventListener('DOMContentLoaded', () => {
    const shark = document.getElementById('shark');
    const gameContainer = document.getElementById('gameContainer');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const startButton = document.getElementById('startButton');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreElement = document.getElementById('finalScore');
    const highScoreElement = document.getElementById('highScore');
    const restartButton = document.getElementById('restartButton');
    const biteSound = document.getElementById('biteSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const toggleMusicButton = document.getElementById('toggleMusic');
    const musicVolumeControl = document.getElementById('musicVolume');

    let score = 0;
    let highScore = 0;
    let gameInterval;
    let fishInterval;
    let timeLeft = 60;

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', () => location.reload());

    toggleMusicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
        }
    });

    musicVolumeControl.addEventListener('input', (event) => {
        backgroundMusic.volume = event.target.value;
    });

    function startGame() {
        startButton.style.display = 'none';
        backgroundMusic.play();
        gameInterval = setInterval(updateTimer, 1000);
        fishInterval = setInterval(createFish, 2000);
    }

    function updateTimer() {
        timeLeft--;
        timerElement.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(fishInterval);
        backgroundMusic.pause();
        finalScoreElement.textContent = `Your Score: ${score}`;
        highScore = Math.max(highScore, score);
        highScoreElement.textContent = `High Score: ${highScore}`;
        gameOverScreen.style.display = 'block';
    }

    function moveShark(event) {
        switch (event.key) {
            case 'ArrowUp':
                shark.style.top = Math.max(0, shark.offsetTop - 10) + 'px';
                break;
            case 'ArrowDown':
                shark.style.top = Math.min(gameContainer.clientHeight - shark.clientHeight, shark.offsetTop + 10) + 'px';
                break;
            case 'ArrowLeft':
                shark.style.left = Math.max(0, shark.offsetLeft - 10) + 'px';
                break;
            case 'ArrowRight':
                shark.style.left = Math.min(gameContainer.clientWidth - shark.clientWidth, shark.offsetLeft + 10) + 'px';
                break;
        }
        checkCollision();
    }

    document.addEventListener('keydown', moveShark);

    function createFish() {
        const fish = document.createElement('div');
        fish.className = 'fish';
        const fishSizes = ['50px', '80px', '100px'];
        const fishImages = ['fish.gif', 'fish1.gif', 'fish2.gif', 'fish3.gif']; // רשימת תמונות הדגים
        const randomSize = fishSizes[Math.floor(Math.random() * fishSizes.length)];
        const randomImage = fishImages[Math.floor(Math.random() * fishImages.length)];
        fish.style.width = randomSize;
        fish.style.height = randomSize;
        fish.style.backgroundImage = `url(${randomImage})`;
        fish.style.backgroundSize = 'cover';
        fish.style.position = 'absolute';
        fish.style.top = Math.random() * (gameContainer.clientHeight - parseInt(randomSize)) + 'px';
        fish.style.left = Math.random() * (gameContainer.clientWidth - parseInt(randomSize)) + 'px';
        gameContainer.appendChild(fish);
    }

    function checkCollision() {
        const sharkRect = shark.getBoundingClientRect();
        const fishes = document.querySelectorAll('.fish');
        fishes.forEach(fish => {
            const fishRect = fish.getBoundingClientRect();
            if (
                sharkRect.left < fishRect.left + fishRect.width &&
                sharkRect.left + sharkRect.width > fishRect.left &&
                sharkRect.top < fishRect.top + fishRect.height &&
                sharkRect.top + sharkRect.height > fishRect.top
            ) {
                eatFish(fish);
            }
        });
    }

    function eatFish(fish) {
        biteSound.play();
        fish.remove();
        score++;
        scoreElement.textContent = `Score: ${score}`;
    }
});
