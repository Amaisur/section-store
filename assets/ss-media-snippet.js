
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.play-pause-ss-d5');

    buttons.forEach(button => {
        const video = button.previousElementSibling; // Assuming the button directly follows the video in the DOM
        const playSVG = button.querySelector('.play-svg-d5');
        const pauseSVG = button.querySelector('.pause-svg-d5');

        // Initially hide the pause button
        pauseSVG.style.display = 'none';

        button.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playSVG.style.display = 'none';
                pauseSVG.style.display = 'block';
            } else {
                video.pause();
                playSVG.style.display = 'block';
                pauseSVG.style.display = 'none';
            }
        });

        // Ensure icons are correct when video is played/paused through other means
        video.addEventListener('play', () => {
            playSVG.style.display = 'none';
            pauseSVG.style.display = 'block';
        });
        video.addEventListener('pause', () => {
            playSVG.style.display = 'block';
            pauseSVG.style.display = 'none';
        });
    });
});