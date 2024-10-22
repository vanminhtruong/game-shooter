class PlayerUI {
    constructor(player) {
        this.player = player;
        this.elements = {
            playBtn: document.getElementById('play-btn'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            loopBtn: document.getElementById('loop-btn'),
            progressBar: document.getElementById('progress-bar'),
            progressFilled: document.getElementById('progress-filled'),
            currentTimeElem: document.getElementById('current-time'),
            totalDurationElem: document.getElementById('total-duration'),
            songNameElem: document.getElementById('song-name'),
            songList: document.getElementById('song-list'),
            playlistBtn: document.getElementById('playlist-btn'),
            shuffleBtn: document.getElementById('shuffle-btn'),
        };
        this.isDragging = false;
        this.initEventListeners();
    }

    initEventListeners() {
        this.elements.playBtn.addEventListener('click', () => this.player.togglePlayPause());
        this.elements.prevBtn.addEventListener('click', () => this.player.changeSong(false));
        this.elements.nextBtn.addEventListener('click', () => this.player.changeSong(true));
        this.elements.loopBtn.addEventListener('click', () => this.player.toggleLoop());
        this.elements.progressBar.addEventListener('click', (e) => this.handleProgressBarClick(e));
        this.elements.progressBar.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        document.addEventListener('mousemove', (e) => this.dragProgress(e));
        this.elements.playlistBtn.addEventListener('click', () => this.togglePlaylistVisibility());
        this.elements.shuffleBtn.addEventListener('click', () => this.player.toggleShuffle());
    }

    updatePlayButtonIcon(state) {
        this.elements.playBtn.innerHTML = state === 'play' ? '&#9654;' : '&#10074;&#10074;';
    }

    updateLoopButtonIcon(isLooping) {
        this.elements.loopBtn.style.color = isLooping ? 'red' : 'white';
    }

    updateSongName(song) {
        this.elements.songNameElem.textContent = song;
    }

    updateProgress() {
        const { currentTime, duration } = this.player.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.elements.progressFilled.style.width = `${progressPercent}%`;
        this.elements.currentTimeElem.textContent = this.formatTime(currentTime);
        this.elements.totalDurationElem.textContent = `- ${this.formatTime(duration - currentTime)}`;
    }

    setTotalDuration() {
        this.elements.totalDurationElem.textContent = this.formatTime(this.player.audio.duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    updatePlaylist() {
        this.elements.songList.innerHTML = '';
        this.player.state.songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = song;
            li.classList.add('song-item');
            if (index === this.player.state.currentSongIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => this.player.setCurrentSongIndex(index));
            this.elements.songList.appendChild(li);
        });
    }

    togglePlaylistVisibility() {
        const playlist = document.querySelector('.playlist');
        playlist.style.display = playlist.style.display === 'none' ? 'block' : 'none';
    }

    handleProgressBarClick(e) {
        const rect = this.elements.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = (clickX / rect.width) * 100;
        this.player.setProgress(percentage);
        this.updateProgress();
    }

    startDrag(e) {
        this.isDragging = true;
        this.handleProgressBarClick(e);
    }

    stopDrag() {
        this.isDragging = false;
    }

    dragProgress(e) {
        if (this.isDragging) {
            const rect = this.elements.progressBar.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const clampedX = Math.max(0, Math.min(offsetX, rect.width));
            this.player.audio.currentTime = (clampedX / rect.width) * this.player.audio.duration;
            this.updateProgress();
        }
    }

    updateShuffleButtonIcon(isShuffling) {
        this.elements.shuffleBtn.style.color = isShuffling ? 'red' : '#fff';
    }
}

export default PlayerUI;
