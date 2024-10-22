import { Egg } from './Egg.js';

export class EggFactory {
    createEgg(letter) {
        return new Egg(letter);
    }
}