document.addEventListener("DOMContentLoaded", function() {
    const mediaDivs = document.querySelectorAll('.general-media-d5');

    mediaDivs.forEach(div => {
        const video = div.querySelector('video');
        const button = div.querySelector('button');

        class VideoController {
            constructor(video, button) {
                this.video = video;
                this.button = button;
                this.initEvents();
            }

            playVideo() {
                console.log("Attempting to play video.");
                this.video.play()
                  .then(() => {
                      console.log("Video is now playing.");
                  })
                  .catch(e => {
                      console.error("Error occurred when trying to play the video: ", e);
                  });
                this.updateButton('pause');
            }

            pauseVideo() {
                console.log("Attempting to pause video.");
                this.video.pause();
                this.updateButton('play');
            }

            updateButton(mode) {
                console.log(`Updating button to ${mode} mode.`);
                if (mode === 'play') {
                    this.button.className = 'play-btn-d5';
                    this.button.textContent = 'Play';
                } else {
                    this.button.className = 'pause-btn-d5';
                    this.button.textContent = 'Pause';
                }
            }

            initEvents() {
                this.button.addEventListener('click', () => {
                    console.log("Button clicked. Video paused state: ", this.video.paused);
                    if (this.video.paused) {
                        this.playVideo();
                    } else {
                        this.pauseVideo();
                    }
                });

                this.video.addEventListener('play', () => {
                    console.log("Video event: play");
                    this.updateButton('pause');
                });
                this.video.addEventListener('pause', () => {
                    console.log("Video event: pause");
                    this.updateButton('play');
                });
            }
        }

        new VideoController(video, button);
    });
});
