class MediaPlayer {
  constructor() {
    this.buttons = document.querySelectorAll(".play-pause-ss-d5");
  }

  updatePlayContent(button, isPlay = false) {
    const playSVG = button.querySelector(".play-svg-d5");
    const pauseSVG = button.querySelector(".pause-svg-d5");

    playSVG.style.display = isPlay ? "none" : "block";
    pauseSVG.style.display = isPlay ? "block" : "none";

    if (isPlay) {
      button.classList.add("active-video-d5");
    } else {
      button.classList.remove("active-video-d5");
    }
  }

  playState(button, video) {
    button.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        this.updatePlayContent(button, true);
      } else {
        video.pause();
        this.updatePlayContent(button, false);
      }
    });
  }

  videoPlay(button, video) {
    video.addEventListener("play", () => {
      this.updatePlayContent(button, true);
    });
  }

  videoPause(button, video) {
    video.addEventListener("pause", () => {
      this.updatePlayContent(button, false);
    });
  }

  setUpEvent() {
    this.buttons.forEach((button) => {
      const video = button.previousElementSibling;  // Assuming the video is the previous sibling of the button
      this.playState(button, video);
      this.videoPlay(button, video);
      this.videoPause(button, video);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const mediaPlayer = new MediaPlayer();
  mediaPlayer.setUpEvent();
});
