
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
    const response = await fetch('/?section_id=d5-cart-drawer');
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
      if (window.rewardsConfig) initRewardsBar(window.rewardsConfig,'cd-rewards-bar-d5')
    }
    
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

  function initRewardsBar(c, id) {
  var e = document.getElementById(id);
  if (!e) return;
  var rc = c.rewardCount;
  var t = c.thresholds;
  var l = c.labels;
  var i = c.icons;
  var ct = c.cartTotal;
  var mt = t[t.length-1]||0;
  var p = mt ? Math.min(Math.round(ct/mt*100),100) : 0;
  var h = '<div class="cd-rewards-bar-d5" render-d5>'
        + '<div class="cd-free-shipping-bar__content-d5">'
        + '<p class="cd-free-shipping-bar__text-d5"></p>'
        + '</div>'
        + '<div class="cd-free-shipping-bar-d5">'
        + '<div class="cd-free-shipping-bar__inner-d5" style="width:'+p+'%;"></div>';
  t.forEach(function(v,x){
    var pos = mt ? v/mt*100 : 0;
    h += '<div class="cd-free-shipping-bar__icon-d5" style="left:calc('+pos+'% - 40px)">'
      + '<span class="cd-icon-tag-d5" style="background-image:url(\''+i[x]+'\')"></span>'
      + '<span class="cd-icon-tooltip-d5">'+l[x]+'</span>'
      + '</div>';
  });
  h += '</div></div>';
  e.innerHTML = h;
  var txt = '';
  if (ct >= mt) {
    txt = 'All <strong>Rewards</strong> Unlocked!';
  } else if (rc === 3 && ct >= t[1]) {
    txt = 'You have unlocked '+l[0]+' and you are <strong>'+(mt-ct)+'</strong> from unlocking '+l[2];
  } else if (ct >= t[0] && rc >= 2) {
    txt = 'You are <strong>'+(t[1]-ct)+'</strong> from unlocking '+l[1];
  } else {
    txt = 'You are <strong>'+(t[0]-ct)+'</strong> from unlocking '+l[0];
  }
  e.querySelector('.cd-free-shipping-bar__text-d5').innerHTML = txt;
}
document.addEventListener('DOMContentLoaded',function(){
  if (window.rewardsConfig) initRewardsBar(window.rewardsConfig,'cd-rewards-bar-d5');
});

})();