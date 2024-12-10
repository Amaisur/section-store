  (function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;

    // Set your sale target date and time here (e.g., "December 31, 2024, 23:59:59")
    const saleEndDate = document.querySelector('.ss-timer-ul').getAttribute('ss-date-time');  // You can modify this to any date and time

    const countDown = new Date(saleEndDate).getTime();

    // Function to format numbers as two digits
    const formatNumber = (num) => (num < 10 ? "0" : "") + num;

    const x = setInterval(function() {
      const now = new Date().getTime(),
            distance = countDown - now;

      // Calculate days, hours, minutes, and seconds left
      document.getElementById("days").innerText = formatNumber(Math.floor(distance / day));
      document.getElementById("hours").innerText = formatNumber(Math.floor((distance % day) / hour));
      document.getElementById("minutes").innerText = formatNumber(Math.floor((distance % hour) / minute));
      document.getElementById("seconds").innerText = formatNumber(Math.floor((distance % minute) / second));

      // When the countdown finishes
      if (distance < 0) {
        // Add class to the div with the countdown
        document.getElementById("ss-countdown").classList.add("ss-sale-on-d5");

        // Optionally, you can stop the countdown display after it ends
        clearInterval(x);
      }
    }, 1000);
  }());
