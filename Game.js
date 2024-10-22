import { LETTERS } from './utils.js';
import { EggFactory } from './EggFactory.js';
import { Player } from './Player.js';
import { ScoreBoard } from './ScoreBoard.js';

export class Game {
    constructor() {
        this.initializeGame();
    }

    initializeGame() {
        this.initializeGameComponents();
        this.initializeGameState();
        this.bindEvents();
        this.startGameLoop();

        // Bind the custom eggClicked event
        document.addEventListener('eggClicked', this.handleEggClick.bind(this));

        this.missedEggs = 0;
        this.maxMissedEggs = 5;
    }

    initializeGameComponents() {
        this.eggsContainer = document.getElementById('eggs-container');
        this.player = new Player();
        this.scoreBoard = new ScoreBoard();
        this.eggFactory = new EggFactory();
    }

    initializeGameState() {
        this.eggs = [];
        this.lastSpawnTime = 0;
        this.spawnInterval = 1500; // Consider making this configurable
        this.isRunning = true;
        this.keysPressed = {
            ArrowLeft: false,
            ArrowRight: false
        };
    }

    bindEvents() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('resize', this.handleResize);
    }

    handleKeyDown = (event) => {
        const { key } = event;
        if (this.isArrowKey(key)) {
            event.preventDefault();
            this.keysPressed[key] = true;
        } else {
            this.handleLetterPress(key);
        }
    }

    handleKeyUp = (event) => {
        const { key } = event;
        if (this.isArrowKey(key)) {
            this.keysPressed[key] = false;
        }
    }

    isArrowKey(key) {
        return key === 'ArrowLeft' || key === 'ArrowRight';
    }

    handleLetterPress(letter) {
        const upperLetter = letter.toUpperCase();
        const eggIndex = this.eggs.findIndex(egg => egg.letter.toUpperCase() === upperLetter);
        if (eggIndex !== -1) {
            const egg = this.eggs[eggIndex];
            this.setPlayerTargetPosition(egg);
        }
    }

    setPlayerTargetPosition(egg) {
        const windowWidth = window.innerWidth;
        const eggRect = egg.getElement().getBoundingClientRect();
        const eggCenterX = eggRect.left + (eggRect.width / 2);
        const playerRect = this.player.element.getBoundingClientRect();
        const playerWidth = playerRect.width;
        const offset = playerWidth / 2 + 5; // Adjust offset as needed
        let newPlayerPosition = eggCenterX - (playerWidth / 2) + offset;

        // Ensure the player doesn't move out of bounds
        newPlayerPosition = Math.max(0, Math.min(newPlayerPosition, windowWidth - playerWidth));

        this.player.setTargetPosition(newPlayerPosition);

        console.debug('Egg center:', eggCenterX);
        console.debug('Player width:', playerWidth);
        console.debug('Offset:', offset);
        console.debug('New player position:', newPlayerPosition);
    }

    spawnEgg(letter) {
        const egg = this.eggFactory.createEgg(letter);
        this.eggsContainer.appendChild(egg.getElement());
        this.eggs.push(egg);
    }

    spawnEggsPeriodically(timestamp) {
        if (this.shouldSpawnEgg(timestamp)) {
            const randomLetter = this.getRandomLetter();
            this.spawnEgg(randomLetter);
            this.lastSpawnTime = timestamp;
        }
    }

    shouldSpawnEgg(timestamp) {
        return timestamp - this.lastSpawnTime > this.spawnInterval;
    }

    getRandomLetter() {
        const randomIndex = Math.floor(Math.random() * LETTERS.length);
        return LETTERS[randomIndex];
    }

    catchEgg(egg) {
        egg.catch();
        this.scoreBoard.increment();
        this.flashPlayer();
    }

    flashPlayer() {
        this.player.element.style.backgroundColor = '#32cd32'; // LimeGreen
        setTimeout(() => {
            this.player.element.style.backgroundColor = '#ff6347'; // Tomato
        }, 200);
    }

    checkCollisions() {
        const playerBounds = this.player.getBounds();
        this.eggs = this.eggs.filter(egg => {
            const eggBounds = egg.getElement().getBoundingClientRect();
            if (this.isColliding(playerBounds, eggBounds)) {
                this.catchEgg(egg);
                egg.remove();
                return false;
            }
            return true;
        });
    }

    isColliding(rect1, rect2) {
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }

    removeOffScreenEggs() {
        this.eggs = this.eggs.filter(egg => {
            if (egg.isOffScreen()) {
                egg.remove();
                this.missedEggs++;
                this.checkGameOver();
                return false;
            }
            return true;
        });
    }

    checkGameOver() {
        if (this.missedEggs >= this.maxMissedEggs) {
            this.gameOver();
        }
    }

    gameOver() {
        this.stop();
        alert('Bạn đã thua! Bạn đã bắt hụt 5 quả trứng.');
        this.resetGame();
    }

    resetGame() {
        // Remove all current eggs
        this.eggs.forEach(egg => egg.remove());
        this.eggs = [];
        this.scoreBoard.reset();
        this.player.resetPosition();
        this.missedEggs = 0;
        this.lastSpawnTime = 0;
        this.updateMissedEggsDisplay();
        this.start();
    }

    updateMissedEggsDisplay() {
        // Implement display update logic if necessary
    }

    updateEggs() {
        this.eggs.forEach(egg => egg.updatePosition());
    }

    handleResize = () => {
        const maxPosition = window.innerWidth - this.player.element.offsetWidth;
        if (this.player.position > maxPosition) {
            this.player.setPosition(maxPosition);
        }
    }

    updatePlayer() {
        if (this.keysPressed.ArrowLeft) {
            this.player.move('left');
        } else if (this.keysPressed.ArrowRight) {
            this.player.move('right');
        } else {
            this.player.moveTowardsTarget();
        }
    }

    gameLoop = (timestamp) => {
        if (!this.isRunning) return;

        this.spawnEggsPeriodically(timestamp);
        this.updatePlayer();
        this.updateEggs();
        this.checkCollisions();
        this.removeOffScreenEggs();

        requestAnimationFrame(this.gameLoop);
    }

    startGameLoop() {
        requestAnimationFrame(this.gameLoop);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startGameLoop();
        }
    }

    stop() {
        this.isRunning = false;
    }

    handleEggClick(event) {
        const { egg } = event.detail;
        this.setPlayerTargetPosition(egg);
    }
}
