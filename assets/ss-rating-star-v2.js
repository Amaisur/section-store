class StarRating {
    constructor(containerSelector) {
        // Get all the rating containers (i.e., elements where the stars will be rendered)
        this.containers = document.querySelectorAll(containerSelector);
        
        // Fetch the image sources from the HTML (you defined them in the <img> tags)
        this.fullStar = document.querySelector('.star.full').src;
        this.halfStar = document.querySelector('.star.partial').src;
        this.emptyStar = document.querySelector('.star.empty').src;
    }

    renderStars() {
        // Iterate over each container and render the stars based on the rating attribute
        this.containers.forEach(container => {
            const rating = parseFloat(container.getAttribute('data-rating'));

            // Ensure rating is between 0 and 5
            if (rating < 0 || rating > 5 || isNaN(rating)) {
                console.error('Invalid rating value. Please provide a number between 0 and 5.');
                return;
            }

            let starsHTML = ''; // Create an empty string to accumulate stars

            // Calculate number of full stars
            const fullStarsCount = Math.floor(rating);

            // Calculate the decimal part of the rating
            const decimalPart = rating % 1;

            // Determine if a half star is needed (any decimal part >= 0.1)
            let partialStar = '';
            let partialStarWidth = 0;
            if (decimalPart >= 0.1) {
                partialStar = this.halfStar;
                // The width of the partial star should be proportional to the fractional part
                partialStarWidth = Math.round(decimalPart * 100);
            }

            // Calculate the number of empty stars
            const emptyStarsCount = 5 - fullStarsCount - (partialStar ? 1 : 0);

            // Add full stars
            starsHTML += `<img class="star full" src="${this.fullStar}" alt="Full star">`.repeat(fullStarsCount);

            // Add partial star with a width attribute for the ::before pseudo-element
            if (partialStar) {
                starsHTML += `<img class="star partial" src="${this.halfStar}" alt="Partial star" style="width: ${partialStarWidth}%">`;
            }

            // Add empty stars
            starsHTML += `<img class="star empty" src="${this.emptyStar}" alt="Empty star">`.repeat(emptyStarsCount);

            // Set the container's innerHTML with the accumulated stars
            container.innerHTML = starsHTML;
        });
    }
}

// Instantiate the StarRating class and render the stars for all containers
document.addEventListener("DOMContentLoaded", () => {
    const starRating = new StarRating('.rating-container');
    starRating.renderStars();
});
