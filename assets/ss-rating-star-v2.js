class StarRating {
  constructor(containerSelector) {
    this.containers = document.querySelectorAll(containerSelector);
  }

  renderStars() {
    this.containers.forEach((container) => {
      if (container.querySelector('.ss-star')) {
        return;
      }

      const rating = parseFloat(container.getAttribute("ss-data-rating"));

      if (rating < 0 || rating > 5 || isNaN(rating)) {
        console.error("Invalid rating value. Please provide a number between 0 and 5.");
        return;
      }

      let starsHTML = "";

      const fullStarsCount = Math.floor(rating);
      const decimalPart = rating % 1;
      const partialStarWidth = decimalPart >= 0.1 ? Math.round(decimalPart * 100) : 0;
      const emptyStarsCount = 5 - fullStarsCount - (partialStarWidth > 0 ? 1 : 0);

      const sectionClass = container.classList.contains('ss-section-1') ? '1' :
                           container.classList.contains('ss-section-2') ? '2' : 'default';

      for (let i = 0; i < fullStarsCount; i++) {
        starsHTML += this.createStarHTML(sectionClass, 'full');
      }

      if (partialStarWidth > 0) {
        starsHTML += this.createStarHTML(sectionClass, 'partial', partialStarWidth);
      }

      for (let i = 0; i < emptyStarsCount; i++) {
        starsHTML += this.createStarHTML(sectionClass, 'empty');
      }

      container.innerHTML = starsHTML;
    });
  }

  createStarHTML(sectionClass, type, partialWidth = 0) {
    const star = document.createElement('div');
    star.classList.add('ss-star', `ss-${type}`);
    const imagePath = `path/to/${type}-star-${sectionClass}.png`;
    star.style.backgroundImage = `url(${imagePath})`;

    if (type === 'partial' && partialWidth > 0) {
      star.style.setProperty('--partial-width', `${partialWidth}%`);
    }

    return star.outerHTML;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.starRatingInstance) {
    const starRating = new StarRating(".ss-rating-container");
    window.starRatingInstance = starRating;
    starRating.renderStars();
  }
});
