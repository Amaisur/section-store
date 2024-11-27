
class VideoPlayer {
    constructor(video, button) {
        this.video = video;
        this.button = button;
        this.playSVG = button.querySelector('.play-svg-d5');
        this.pauseSVG = button.querySelector('.pause-svg-d5');
        this.initControls();
    }

    initControls() {
        // Initially set button state based on video state
        this.video.paused ? this.updateButtonForPause() : this.updateButtonForPlay();

        this.button.addEventListener('click', () => {
            console.log("Button clicked. Toggling play/pause.");
            this.togglePlayPause();
        });

        this.video.addEventListener('play', () => {
            console.log("Video is playing.");
            this.updateButtonForPlay();
        });

        this.video.addEventListener('pause', () => {
            console.log("Video is paused.");
            this.updateButtonForPause();
        });
    }

    togglePlayPause() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    updateButtonForPlay() {
        this.playSVG.style.display = 'none';
        this.pauseSVG.style.display = 'block';
    }

    updateButtonForPause() {
        this.playSVG.style.display = 'block';
        this.pauseSVG.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mediaDivs = document.querySelectorAll('.general-media-d5');

    mediaDivs.forEach(div => {
        const video = div.querySelector('video');
        const button = div.querySelector('.play-pause-ss-d5');
        console.log("Initializing video player for:", video, button);
        new VideoPlayer(video, button);
    });
});
