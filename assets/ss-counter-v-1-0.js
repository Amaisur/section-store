class CountdownTimer {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.second = 1000;
    this.minute = this.second * 60;
    this.hour = this.minute * 60;
    this.day = this.hour * 24;
    this.timers = new Map(); // Use a Map to manage timers associated with elements
  }

  formatNumber(num) {
    return num < 10 ? "0" + num : num.toString();
  }

 updateCountdown(element) {
    const countDownDate = new Date(element.getAttribute('ss-date-time')).getTime();
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance <= 0) {
        // Stop the countdown and apply class
        element.querySelector("#ss-days").innerText = "00";
        element.querySelector("#ss-hours").innerText = "00";
        element.querySelector("#ss-minutes").innerText = "00";
        element.querySelector("#ss-seconds").innerText = "00";
        
        element.classList.add("ss-sale-on-d5");

        // Clear the interval if the countdown has finished
        clearInterval(this.timers.get(element));
        this.timers.delete(element);
    } else {
        const days = this.formatNumber(Math.floor(distance / this.day));
        const hours = this.formatNumber(Math.floor((distance % this.day) / this.hour));
        const minutes = this.formatNumber(Math.floor((distance % this.hour) / this.minute));
        const seconds = this.formatNumber(Math.floor((distance % this.minute) / this.second));

        element.querySelector("#ss-days").innerText = days;
        element.querySelector("#ss-hours").innerText = hours;
        element.querySelector("#ss-minutes").innerText = minutes;
        element.querySelector("#ss-seconds").innerText = seconds;
    }
}


  start() {
    this.elements.forEach(element => {
      if (!this.timers.has(element)) {
        const intervalId = setInterval(() => this.updateCountdown(element), 1000);
        this.timers.set(element, intervalId);
      }
    });
  }
}

// Usage
const countdown = new CountdownTimer('.ss-timer-ul');
countdown.start();
