import AudioPlayer from './AudioPlayer.js';

class ShuffleAudioPlayer extends AudioPlayer {
    constructor() {
        super();
        this.state.isShuffling = false;
        this.shuffledIndices = [];
    }

    toggleShuffle() {
        this.state.isShuffling = !this.state.isShuffling;
        if (this.state.isShuffling) {
            this.shufflePlaylist();
        } else {
            this.shuffledIndices = [];
        }
        if (this.ui) {
            this.ui.updateShuffleButtonIcon(this.state.isShuffling);
        }
    }

    shufflePlaylist() {
        this.shuffledIndices = [...Array(this.state.songs.length).keys()];
        for (let i = this.shuffledIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledIndices[i], this.shuffledIndices[j]] = [this.shuffledIndices[j], this.shuffledIndices[i]];
        }
    }

    changeSong(forward = true) {
        if (this.state.isShuffling) {
            const currentShuffleIndex = this.shuffledIndices.indexOf(this.state.currentSongIndex);
            const newShuffleIndex = forward ? 
                (currentShuffleIndex + 1) % this.shuffledIndices.length : 
                (currentShuffleIndex - 1 + this.shuffledIndices.length) % this.shuffledIndices.length;
            this.setCurrentSongIndex(this.shuffledIndices[newShuffleIndex]);
        } else {
            super.changeSong(forward);
        }
    }
}

export default ShuffleAudioPlayer;
