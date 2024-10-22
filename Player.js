export class Player {
    constructor() {
        this.element = document.getElementById('player');
        this.position = window.innerWidth / 2 - this.element.offsetWidth / 2;
        this.moveSpeed = 3; // pixels per frame
        this.fastMoveSpeed = 80; // New faster speed for moving towards target
        this.updatePosition();
    }

    move(direction) {
        if (direction === 'left') {
            this.position = Math.max(0, this.position - this.moveSpeed);
        } else if (direction === 'right') {
            this.position = Math.min(window.innerWidth - this.element.offsetWidth, this.position + this.moveSpeed);
        }
        this.updatePosition();
    }

    setPosition(x) {
        this.position = Math.min(Math.max(x, 0), window.innerWidth - this.element.offsetWidth);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.position}px`;
    }

    getBounds() {
        const rect = this.element.getBoundingClientRect();
        return {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom
        };
    }

    moveTowardsTarget() {
        if (this.targetPosition === undefined) return;

        const distance = this.targetPosition - this.position;
        if (Math.abs(distance) < this.fastMoveSpeed) {
            this.setPosition(this.targetPosition);
            this.targetPosition = undefined;
        } else {
            const direction = distance > 0 ? 1 : -1;
            this.setPosition(this.position + direction * this.fastMoveSpeed);
        }
    }

    setTargetPosition(x) {
        this.targetPosition = Math.min(Math.max(x, 0), window.innerWidth - this.element.offsetWidth);
    }
}
