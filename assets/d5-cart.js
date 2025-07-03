
(function () {
  const cart = document.querySelector('.cart-drawer-d5');
  const cartIcon = document.querySelector('#cart-icon-bubble');
  const rewardsBar = cart.querySelector('[shipping-bar-d5]');
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
    const response = await fetch('/?section_id=d5-cart-drawer');
    const data = await response.text();
    const doc = new DOMParser().parseFromString(data, 'text/html');
    const newDrawer = doc.querySelector('.cd-inner-d5');
    const cartInner = document.querySelector('.cd-inner-d5');
    if (cartInner) {
      cartInner.innerHTML = newDrawer.innerHTML;
      addEventListenersToCart();
    }
    const dataW = rewardsBar.getAttribute('data-width');
    rewardsBar.style.width = dataW;
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
})();