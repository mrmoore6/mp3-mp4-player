const fileInput = document.getElementById("fileInput");
const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const card = document.querySelector(".container");
const progressFill = document.querySelector(".progress-fill");
const muteBtn = document.getElementById("muteBtn");
const darkModeBtn = document.getElementById("darkMode");
const back10Btn = document.getElementById("back10");
const forward10Btn = document.getElementById("forward10");
const playlist = document.getElementById("playlist");
const nextSongBtn = document.getElementById("nextSong");
const prevSongBtn = document.getElementById("prevSong");
const noFilesText = document.getElementById("noFiles");

fileInput.addEventListener("change", function () {
  const file = event.target.files[0];
  const audioUrl = URL.createObjectURL(file);
  audioPlayer.src = audioUrl;
  const songs = document.createElement("li");
  songs.textContent = file.name;
  playlist.appendChild(songs);
  songs.file = file;
  songs.addEventListener("click", function () {
    playlist
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("current"));
    songs.classList.add("current");
    audioPlayer.src = URL.createObjectURL(songs.file);
    audioPlayer.play();
    playBtn.innerHTML =
      "<svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'/></svg>";
  });
});

playlist.appendChild(fileInput);

nextSongBtn.addEventListener("click", function () {
  const lis = Array.from(playlist.querySelectorAll("li"));
  if (!lis.length) return;
  const currentIndex = lis.findIndex((li) => li.classList.contains("current"));
  const nextIndex = (currentIndex + 1) % lis.length;
  lis.forEach((li) => li.classList.remove("current"));
  lis[nextIndex].classList.add("current");
  audioPlayer.src = URL.createObjectURL(lis[nextIndex].file);
  audioPlayer.play();
  playBtn.innerHTML =
    "<svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'/></svg>";
});

prevSongBtn.addEventListener("click", function () {
  const lis = Array.from(playlist.querySelectorAll("li"));
  if (!lis.length) return;
  const currentIndex = lis.findIndex((li) => li.classList.contains("current"));
  const prevIndex = (currentIndex - 1 + lis.length) % lis.length;
  lis.forEach((li) => li.classList.remove("current"));
  lis[prevIndex].classList.add("current");
  audioPlayer.src = URL.createObjectURL(lis[prevIndex].file);
  audioPlayer.play();
  playBtn.innerHTML =
    "<svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'/></svg>";
});
playBtn.addEventListener("click", function () {
  if (audioPlayer.paused) {
    audioPlayer.play();
    if (!playlist.querySelector("li.current")) {
      const firstLi = playlist.querySelector("li");
      if (firstLi) {
        currentIndex = 0;
        audioPlayer.src = URL.createObjectURL(firstLi.file);
        firstLi.classList.add("current");
      }
    }
    playBtn.innerHTML =
      "<svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'/></svg>";
  } else {
    audioPlayer.pause();
    playBtn.innerHTML =
      "<svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M8 5v14l11-7z'/></svg>";
  }
});

audioPlayer.addEventListener("ended", function () {
  playBtn.innerHTML =
    "<svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><path d='M8 5v14l11-7z'/></svg>";
});

muteBtn.addEventListener("click", function () {
  audioPlayer.muted = !audioPlayer.muted;
  muteBtn.textContent = audioPlayer.muted ? "Unmute" : "Mute";
});

darkModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  darkModeBtn.textContent = document.body.classList.contains("dark-mode")
    ? "Light Mode"
    : "Dark Mode";
});

const progressBar = document.createElement("input");

progressBar.classList.add("progress-bar");
progressBar.type = "range";
progressBar.min = 0;
progressBar.max = 100;
progressBar.value = 0;
card.append(progressBar);
console.log(progressBar);
console.log(card);

audioPlayer.addEventListener("timeupdate", function () {
  const current = formatTime(audioPlayer.currentTime);
  const duration = formatTime(audioPlayer.duration);

  timeDisplay.textContent = current + " / " + duration;
});

function scrubbing(event) {
  const percent = event.target.value;
  audioPlayer.currentTime = (percent / 100) * audioPlayer.duration;
}

progressBar.addEventListener("mousedown", function () {
  isScrubbing = true;
});

progressBar.addEventListener("mouseup", function () {
  isScrubbing = false;
  scrubbing(event);
});

progressBar.addEventListener("input", scrubbing);

function updateProgressBar() {
  if (audioPlayer.duration) {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = percent;
  }
  requestAnimationFrame(updateProgressBar);
}
updateProgressBar();

const timeDisplay = document.createElement("p");
timeDisplay.textContent = "0.00 / 0.00";
card.append(timeDisplay);

const formatTime = function (seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ":" + String(secs).padStart(2, "0");
};

back10Btn.addEventListener("click", function () {
  audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
});

forward10Btn.addEventListener("click", function () {
  audioPlayer.currentTime = Math.min(
    audioPlayer.duration,
    audioPlayer.currentTime + 10,
  );
});

noFilesText.style.display = "block";

fileInput.addEventListener("change", function () {
  if (fileInput.files.length > 0) {
    noFilesText.style.display = "none";
  } else {
    noFilesText.style.display = "block";
  }
});
