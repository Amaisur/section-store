class VideoPlayer {
    constructor(video, button) {
        this.video = video;
        this.button = button;
        this.playSVG = button.querySelector('.play-svg-d5');
        this.pauseSVG = button.querySelector('.pause-svg-d5');
        this.initControls();
    }

    initControls() {
        // Hide pause SVG initially
        this.pauseSVG.style.display = 'none';

        // Event listener for button click
        this.button.addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Event listeners to update icons based on video state changes
        this.video.addEventListener('play', () => {
            this.updateButtonForPlay();
        });

        this.video.addEventListener('pause', () => {
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
        new VideoPlayer(video, button);
    });
});