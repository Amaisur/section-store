
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
                this.video.play();
                this.updateButton('pause');
            }

            pauseVideo() {
                this.video.pause();
                this.updateButton('play');
            }

            updateButton(mode) {
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
                    if (this.video.paused) {
                        this.playVideo();
                    } else {
                        this.pauseVideo();
                    }
                });

                this.video.addEventListener('play', () => this.updateButton('pause'));
                this.video.addEventListener('pause', () => this.updateButton('play'));
            }
        }

        new VideoController(video, button);
    });