class CountdownTimer {
  constructor(selector) {
    this.selector = selector;
    this.second = 1000;
    this.minute = this.second * 60;
    this.hour = this.minute * 60;
    this.day = this.hour * 24;
    this.saleEndDate = document.querySelector(this.selector).getAttribute('ss-date-time');
    this.countDown = new Date(this.saleEndDate).getTime();
    this.timerInterval = null;
  }

  formatNumber(num) {
    return num < 10 ? "0" + num : num.toString();
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.countDown - now;

    document.getElementById("days").innerText = this.formatNumber(Math.floor(distance / this.day));
    document.getElementById("hours").innerText = this.formatNumber(Math.floor((distance % this.day) / this.hour));
    document.getElementById("minutes").innerText = this.formatNumber(Math.floor((distance % this.hour) / this.minute));
    document.getElementById("seconds").innerText = this.formatNumber(Math.floor((distance % this.minute) / this.second));

    if (distance < 0) {
      document.getElementById("ss-countdown").classList.add("ss-sale-on-d5");
      clearInterval(this.timerInterval);
    }
  }

  start() {
    this.timerInterval = setInterval(() => this.updateCountdown(), 1000);
  }
}

// Usage
const countdown = new CountdownTimer('.ss-timer-ul');
countdown.start();
