
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.play-pause-ss-d5');

    buttons.forEach(button => {
        const video = button.previousElementSibling;
        const playSVG = button.querySelector('.play-svg-d5');
        const pauseSVG = button.querySelector('.pause-svg-d5');
        pauseSVG.style.display = 'none';

        button.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playSVG.style.display = 'none';
                pauseSVG.style.display = 'block';
                button.classList.add('active-video-d5');
            } else {
                video.pause();
                playSVG.style.display = 'block';
                pauseSVG.style.display = 'none';
                button.classList.remove('active-video-d5');
            }
        });
        video.addEventListener('play', () => {
            playSVG.style.display = 'none';
            pauseSVG.style.display = 'block';
            button.classList.add('active-video-d5');
        });
        video.addEventListener('pause', () => {
            playSVG.style.display = 'block';
            pauseSVG.style.display = 'none';
            button.classList.remove('active-video-d5');
        });
    });
});