
const audio = document.getElementById("voice");
const distanceSlider = document.getElementById("distance");
const panSlider = document.getElementById("pan");

const distanceValue = document.getElementById("distanceValue");
const panValue = document.getElementById("panValue");
const startButton = document.getElementById("start");

let audioContext;
let gainNode;
let pannerNode;
let source;

startButton.addEventListener("click", async () => {
  if (!audioContext) {
    audioContext = new AudioContext();

    source = audioContext.createMediaElementSource(audio);
    gainNode = audioContext.createGain();
    pannerNode = audioContext.createStereoPanner();

    source.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(audioContext.destination);
  }

  await audioContext.resume();

  audio.play();
  updateAudio();
});

function updateAudio() {
  if (!gainNode || !pannerNode) return;

  const distance = Number(distanceSlider.value);
  const pan = Number(panSlider.value);

  // Closer means louder; farther means quieter.
  const volume = 1 / (1 + distance * 0.25);

  gainNode.gain.setTargetAtTime(
    volume,
    audioContext.currentTime,
    0.05
  );

  pannerNode.pan.setTargetAtTime(
    pan,
    audioContext.currentTime,
    0.05
  );

  distanceValue.textContent = distance;
  panValue.textContent = pan.toFixed(1);
}

distanceSlider.addEventListener("input", updateAudio);
panSlider.addEventListener("input", updateAudio);
