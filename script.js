const audioPlayer = document.getElementById('audioPlayer');
const buttons = document.querySelectorAll('.music-btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.audio;
    if (!src) return;

    if (audioPlayer.src.includes(src) && !audioPlayer.paused) {
      audioPlayer.pause();
      btn.textContent = btn.textContent.replace('⏸', '🎵');
      return;
    }

    audioPlayer.src = src;
    audioPlayer.currentTime = 0;
    audioPlayer.play();

    buttons.forEach(b => {
      b.textContent = b.textContent.replace('⏸', '🎵');
    });

    btn.textContent = btn.textContent.replace('🎵', '⏸');
  });
});

