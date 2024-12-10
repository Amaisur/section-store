class CountdownTimer {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.second = 1000;
    this.minute = this.second * 60;
    this.hour = this.minute * 60;
    this.day = this.hour * 24;
    this.timers = [];
  }

  formatNumber(num) {
    return num < 10 ? "0" + num : num.toString();
  }

  updateCountdown(element) {
    const countDownDate = new Date(element.getAttribute('ss-date-time')).getTime();
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const days = this.formatNumber(Math.floor(distance / this.day));
    const hours = this.formatNumber(Math.floor((distance % this.day) / this.hour));
    const minutes = this.formatNumber(Math.floor((distance % this.hour) / this.minute));
    const seconds = this.formatNumber(Math.floor((distance % this.minute) / this.second));

    element.querySelector("#ss-days").innerText = days;
    element.querySelector("#ss-hours").innerText = hours;
    element.querySelector("#ss-minutes").innerText = minutes;
    element.querySelector("#ss-seconds").innerText = seconds;

    if (distance < 0) {
      element.querySelector("#ss-countdown").classList.add("ss-sale-on-d5");
      if (this.timers[element]) {
        clearInterval(this.timers[element]);
        this.timers[element] = null;
      }
    }
  }

  start() {
    this.elements.forEach(element => {
      this.timers[element] = setInterval(() => this.updateCountdown(element), 1000);
    });
  }
}

// Usage
const countdown = new CountdownTimer('.ss-timer-ul');
countdown.start();
