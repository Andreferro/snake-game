function moveBackground(e) {
  const x = e.clientX;
  const y = e.clientY;

  const bgX = x * 0.005;
  const bgY = y * 0.005;

  const bgElement = document.getElementById('container');
  bgElement.style.setProperty('--position-x', (bgX + 50) + '%');
  bgElement.style.setProperty('--position-y', (bgY + 50) + '%');
}

window.addEventListener('mousemove', function (e) {
  if (!isPlaying) moveBackground(e);
});
