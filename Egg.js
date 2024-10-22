export class Egg {
    constructor(letter) {
        this.letter = letter;
        this.speed = 2; // pixels per frame
        this.position = {
            x: Math.floor(Math.random() * (window.innerWidth - 40)),
            y: -50 // start above the viewport
        };
        this.element = this.createElement();
    }

    createElement() {
        const eggDiv = document.createElement('div');
        eggDiv.classList.add('egg');
        eggDiv.textContent = this.letter;
        eggDiv.style.left = `${this.position.x}px`;
        eggDiv.style.top = `${this.position.y}px`;

        // Add click event listener to the egg
        eggDiv.addEventListener('click', () => {
            const event = new CustomEvent('eggClicked', { detail: { egg: this } });
            document.dispatchEvent(event);
        });

        return eggDiv;
    }

    updatePosition() {
        this.position.y += this.speed;
        this.element.style.top = `${this.position.y}px`;
    }

    getElement() {
        return this.element;
    }

    isOffScreen() {
        return this.position.y > window.innerHeight;
    }

    catch() {
        this.speed = 0; // Stop movement
    }

    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
