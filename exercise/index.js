import ShuffleAudioPlayer from './handleLogic/ShuffleAudioPlayer.js';
import PlayerUI from './handleLogic/PlayerUI.js';

// Initialize the player
document.addEventListener('DOMContentLoaded', () => {
    const player = new ShuffleAudioPlayer();
    player.ui = new PlayerUI(player);
    player.loadSong(player.state.songs[player.state.currentSongIndex]);
    player.ui.updatePlaylist();
});
