(function () {
  const cart = document.querySelector('.cart-drawer-d5');
  const cartIcon = document.querySelector('#cart-icon-bubble');

  cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cart.classList.add('cd-drawer__open');
  })
  async function changeQty(line, qty, btn, qtyInput, product) {
    try {
      await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: { [line]: qty } })
      });
    } catch (err) {
      console.error(err);
    } finally {
      await rerenderCart();
      // qtyInput.value = qty;
      btn.classList.remove('loading');
      if(product.classList.contains('item--loading')){
      product.classList.remove('item--loading'); 
    }
    }
  }

  async function rerenderCart() {
    const response = await fetch('/pages/empty-page');
    const data = await response.text();
    const doc = new DOMParser().parseFromString(data, 'text/html');
    const oldElems = document.querySelectorAll('[render-d5]')
    const newElems = doc.querySelectorAll('[render-d5]');
    const dataRW = doc.querySelector('.cd-cart-items-d5');
    const oldIcon = document.querySelector('#cart-icon-bubble');
    const newIcon = doc.querySelector('#cart-icon-bubble');
    if (oldElems && newElems) {
      oldElems.forEach((el, index) => {
        const newElem = newElems[index];
        if (newElem) {
          el.replaceWith(newElem);
        }
      });
    }
    if(oldIcon && newIcon){
      oldIcon.innerHTML = newIcon.innerHTML; 
    }
    addEventListenersToCart();
    const rewardsBar = document.querySelector('.cd-free-shipping-bar__inner-d5');
    if(dataRW){
      let width = dataRW.getAttribute('data-width');
      rewardsBar.style.width = width;
    }
    await autoRemoveSp(document)
  }

document.querySelectorAll('form[action="/cart/add"]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
      if (cart) {
        cart.classList.add('cd-drawer__open', 'atc-loading-d5');
      }
    try {
      await fetch("/cart/add", {
        method: "POST",
        body: new FormData(form),
      });

      if (typeof rerenderCart === 'function') { 
        await rerenderCart();
        cart.classList.remove('atc-loading-d5');
      }

    } catch (error) {
      console.error('Error during form submission:', error);
    }finally{
       if(cart){
        cart.classList.add('cd-drawer__open');
      }
    }
  });
});


  function addEventListenersToCart() {
    const products = document.querySelectorAll('.cd-item-d5');
    products.forEach(product => {
      const qtyBtns = product.querySelectorAll('.cd-qty-btn-d5');
      const qtyInput = product.querySelector('.cd-qty-input-d5');
      const max = +qtyInput.dataset.max;
      const line = product.getAttribute('data-line-item-key');
  
      qtyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          let val = +qtyInput.value;
          if (btn.classList.contains('cd-plus-d5') && val <= max){ 
            btn.classList.add('loading');
            val++;
            changeQty(line, val, btn, qtyInput);
        }
          if (btn.classList.contains('cd-minus-d5') && val > 1) {
            btn.classList.add('loading');
            val--;
            changeQty(line, val, btn, qtyInput);
        }
          if (btn.classList.contains('cd-remove-d5')) {
            btn.classList.add('loading');
            val = 0;
            changeQty(line, val, btn, qtyInput, product);
            product.classList.add('item--loading'); 
        }
        });
      });
    });
  }

  addEventListenersToCart();
  document.querySelectorAll('[close-cart-d5]').forEach(btn => {
    btn.addEventListener('click', () => {
    if(cart.classList.contains('cd-drawer__open')){
        cart.classList.remove('cd-drawer__open');
    }
    document.body.style.overflow = '';
    document.body.classList.remove('overflow-hidden');
    })
  })

 document.addEventListener("click", async (e) => {
  const el = e.target.closest(".sp-t-sp-toggle-d5");
  if (!el) return;

  const variantId = el.dataset.variant;
  const key = el.getAttribute("key");
  if (!variantId) return;

  const shouldRemove = el.classList.contains("active");

  el.classList.add("loading");

  try {
    if (shouldRemove) {
      const res = await fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key, quantity: 0 })
      });
      if (!res.ok) throw new Error("Remove failed");
    } else {
      el.classList.add("active");
      const res = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      });
      if (!res.ok) throw new Error("Add failed");
    }

    if (typeof rerenderCart === "function") {
      await rerenderCart();
    }
  } catch (err) {
    console.error("SP Toggle Error:", err);
    el.classList.remove("loading");
  }
});
async function autoRemoveSp(sele){
  const autoEl = sele.querySelector('.sp-t-sp-toggle-d5.nt-remove-d5');
if (autoEl) {
  const key = autoEl.getAttribute('key');
  if (key) {
    autoEl.classList.add('loading');
    try {
      const res = await fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key, quantity: 0 })
      });
      if (res.ok) {
        autoEl.classList.remove('active', 'loading', 'nt-remove-d5');
        autoEl.classList.add('nt-add-d5');
        autoEl.removeAttribute('key');
        if (typeof rerenderCart === 'function') {
          await rerenderCart();
        }
      }
    } catch {
      autoEl.classList.remove('loading');
    }
  }
}

}
autoRemoveSp(document)

function timerD5(){
const timerElement = document.querySelector('.cd-timer-time-d5');
  const parentElement = document.querySelector('.cd-timer-main-d5');
  const originalTime = {{ section.settings.time | append: ':00' }};
  
  if (localStorage.getItem("timerEnded") === "true") {
    parentElement.classList.add('timer-end-d5');
    return;
  }

  let time = originalTime;
  const endTime = new Date().getTime() + ({{ section.settings.time }} * 60000); // end time for countdown

  function updateTimer() {
    const remainingTime = endTime - new Date().getTime();
    if (remainingTime <= 0) {
      parentElement.classList.add('timer-end-d5');
      localStorage.setItem("timerEnded", "true");
      return;
    }
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  setInterval(updateTimer, 1000);  // Update every second
  updateTimer();
} 
timerD5()
})();