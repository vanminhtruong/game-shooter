class AudioPlayer {
    constructor() {
        this.audio = document.getElementById('audio-player');
        this.state = {
            isPlaying: false,
            isLooping: false,
            currentSongIndex: 0,
            songs: ['./audio/Recording 2024-10-16 225212.mp4', './audio/don.mp3', './audio/len.mp3', './audio/remix.mp3', './audio/see.mp3'],
        };
        this.initEventListeners();
    }

    initEventListeners() {    // hành vi sự kiện
        this.audio.addEventListener('loadedmetadata', () => this.ui.setTotalDuration());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('timeupdate', () => this.ui.updateProgress());
    }

    play() {     // hành vi chơi
        this.audio.play();
        this.state.isPlaying = true;
        this.ui.updatePlayButtonIcon('pause');
    }

    pause() {    // hành vi dừng
        this.audio.pause();
        this.state.isPlaying = false;
        this.ui.updatePlayButtonIcon('play');
    }

    togglePlayPause() {   // hành vi kiểm tra chơi hoặc dừng khi click
        this.state.isPlaying ? this.pause() : this.play();
    }

    loadSong(song) {    // hành vi load bài hát lên
        this.audio.src = song;
        this.audio.load();
        this.ui.updateSongName(song);
    }

    changeSong(forward = true) {     // hành vi chuyển đổi bài hát
        const { currentSongIndex, songs } = this.state;
        const newIndex = forward ? 
            (currentSongIndex + 1) % songs.length : 
            (currentSongIndex - 1 + songs.length) % songs.length;
        this.setCurrentSongIndex(newIndex);
    }

    setCurrentSongIndex(index) {
        // Lưu trữ chỉ số bài hát hiện tại
        const oldIndex = this.state.currentSongIndex;
        // Cập nhật chỉ số bài hát mới
        this.state.currentSongIndex = index;
        // Tải bài hát mới dựa trên chỉ số
        this.loadSong(this.state.songs[index]);
        // Cập nhật giao diện danh sách phát
        this.ui.updatePlaylist();
        // Nếu chỉ số bài hát đã thay đổi, bắt đầu phát
        if (oldIndex !== index) {
            this.play();
        }
    }

    toggleLoop() {  // hành vi xử lý vòng lặp bài hát
        this.state.isLooping = !this.state.isLooping;
        this.audio.loop = this.state.isLooping;
        this.ui.updateLoopButtonIcon(this.state.isLooping);
    }

    handleSongEnd() { // hành vi chuyển bài hát khi đã kết thúc
        if (!this.state.isLooping) {
            this.changeSong(true);
        }
    }

    setProgress(percentage) {
        // Hàm này có chức năng đặt thời điểm phát của bài hát dựa trên phần trăm đã hoàn thành
        // percentage: Phần trăm tiến độ của bài hát (0-100)
        const duration = this.audio.duration;
        this.audio.currentTime = (percentage / 100) * duration;
    }
}

export default AudioPlayer;
