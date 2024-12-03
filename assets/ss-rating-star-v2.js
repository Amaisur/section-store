class StarRating {
  constructor(containerSelector) {
    // Select all containers for each section
    this.containers = document.querySelectorAll(containerSelector);
  }

  renderStars() {
    this.containers.forEach((container) => {
      // Prevent re-rendering if stars are already present
      if (container.querySelector('.ss-star')) {
        return;
      }

      const rating = parseFloat(container.getAttribute("ss-data-rating"));

      // Validate rating
      if (rating < 0 || rating > 5 || isNaN(rating)) {
        console.error("Invalid rating value. Please provide a number between 0 and 5.");
        return;
      }

      let starsHTML = "";

      const fullStarsCount = Math.floor(rating);
      const decimalPart = rating % 1;
      const partialStarWidth = decimalPart >= 0.1 ? Math.round(decimalPart * 100) : 0;
      const emptyStarsCount = 5 - fullStarsCount - (partialStarWidth > 0 ? 1 : 0);

      // Determine the parent section to dynamically select the correct images
      const sectionClass = container.classList.contains('ss-section-1') ? '1' :
                           container.classList.contains('ss-section-2') ? '2' : 'default';

      // Generate full stars
      for (let i = 0; i < fullStarsCount; i++) {
        starsHTML += this.createStarHTML(sectionClass, 'full');
      }

      // Generate partial star if applicable
      if (partialStarWidth > 0) {
        starsHTML += this.createStarHTML(sectionClass, 'partial', partialStarWidth);
      }

      // Generate empty stars
      for (let i = 0; i < emptyStarsCount; i++) {
        starsHTML += this.createStarHTML(sectionClass, 'empty');
      }

      container.innerHTML = starsHTML;
    });
  }

  createStarHTML(sectionClass, type, partialWidth = 0) {
    // Create a star with a dynamic background based on the section
    const star = document.createElement('div');
    star.classList.add('ss-star', `ss-${type}`);
    star.style.backgroundImage = `url('path/to/${type}-star-${sectionClass}.png')`;

    // Handle partial star width
    if (type === 'partial' && partialWidth > 0) {
      star.style.setProperty('--partial-width', `${partialWidth}%`);
    }

    return star.outerHTML;
  }
}

// Ensure the script runs only once after the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if the script has already been initialized to prevent multiple instances
  if (!window.starRatingInstance) {
    const starRating = new StarRating(".ss-rating-container");
    window.starRatingInstance = starRating;  // Store the instance globally to avoid re-instantiation
    starRating.renderStars();
  }
});
