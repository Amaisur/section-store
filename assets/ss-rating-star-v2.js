class MyUniqueStarRating {
  constructor(containerSelector) {
    this.containers = document.querySelectorAll(containerSelector);
  }

  renderStars() {
    this.containers.forEach((container) => {
      const rating = parseFloat(container.getAttribute("ss-data-rating"));
      if (rating < 0 || rating > 5 || isNaN(rating)) {
        console.error("Invalid rating value. Please provide a number between 0 and 5.");
        return;
      }

      let starsHTML = "";

      const fullStar = container.querySelector(".ss-star.ss-full");
      const partialStar = container.querySelector(".ss-star.ss-partial");
      const emptyStar = container.querySelector(".ss-star.ss-empty");

      const fullStarsCount = Math.floor(rating);
      const decimalPart = rating % 1;
      const partialStarWidth = decimalPart >= 0.1 ? Math.round(decimalPart * 100) : 0;
      const emptyStarsCount = 5 - fullStarsCount - (partialStarWidth > 0 ? 1 : 0);

      for (let i = 0; i < fullStarsCount; i++) {
        starsHTML += fullStar.outerHTML;
      }

      if (partialStarWidth > 0) {
        const partialStarElement = partialStar.cloneNode(true);
        partialStarElement.style.setProperty('--partial-width', `${partialStarWidth}%`);
        starsHTML += partialStarElement.outerHTML;
      }

      for (let i = 0; i < emptyStarsCount; i++) {
        starsHTML += emptyStar.outerHTML;
      }

      container.innerHTML = starsHTML;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const starRating = new MyUniqueStarRating(".ss-rating-container");
  starRating.renderStars();
});
