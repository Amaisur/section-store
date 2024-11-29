class StarRating {
  constructor(containerSelector) {
    this.containers = document.querySelectorAll(containerSelector);
    
    // Retrieve the full, partial, and empty star elements from the hidden section
    this.fullStar = document.querySelector(".star.full").style.style.backgroundImage;
    this.partialStar = document.querySelector(".star.partial").style.backgroundImage;
    this.emptyStar = document.querySelector(".star.empty").style.backgroundImage;
  }

  renderStars() {
    this.containers.forEach((container) => {
      const rating = parseFloat(container.getAttribute("ss-data-rating"));
      
      // Validate the rating
      if (rating < 0 || rating > 5 || isNaN(rating)) {
        console.error("Invalid rating value. Please provide a number between 0 and 5.");
        return;
      }

      let starsHTML = ""; // Create an empty string to accumulate stars

      const fullStarsCount = Math.floor(rating); // Number of full stars
      const decimalPart = rating % 1;           // Decimal part for partial star
      const partialStarWidth = decimalPart >= 0.1 ? Math.round(decimalPart * 100) : 0; // Partial star width
      const emptyStarsCount = 5 - fullStarsCount - (partialStarWidth > 0 ? 1 : 0); // Empty stars

      // Add full stars
      for (let i = 0; i < fullStarsCount; i++) {
        starsHTML += this.fullStar.outerHTML; // Clone the full star
      }

      // Add partial star (if applicable)
      if (partialStarWidth > 0) {
        const partialStarElement = this.partialStar.cloneNode(true);
        partialStarElement.style.width = `${partialStarWidth}%`; // Set the width for partial star
        starsHTML += partialStarElement.outerHTML;
      }

      // Add empty stars
      for (let i = 0; i < emptyStarsCount; i++) {
        starsHTML += this.emptyStar.outerHTML; // Clone the empty star
      }

      // Set the container's innerHTML with the generated stars
      container.innerHTML = starsHTML;
    });
  }
}

// Initialize StarRating when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const starRating = new StarRating(".rating-container");
  starRating.renderStars();
});
