export class ScoreBoard {
    constructor() {
        this.score = 0;
        this.scoreElement = document.getElementById('score');
    }

    increment(points = 10) {
        this.score += points;
        this.updateScore();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    reset() {
        this.score = 0;
        this.updateScore();
    }
}
