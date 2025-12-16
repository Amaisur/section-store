(function () { 
'use strict';

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

function init() { const cart = document.querySelector('.cart-drawer-d5'); const cartIcon = document.querySelector('#cart-icon-bubble');

if (!cart) {
  console.warn('[CartDrawer] Cart drawer element not found - script disabled');
  return;
}

if (!cartIcon) {
  console.warn('[CartDrawer] Cart icon not found - click handler disabled');
}

let isProcessingCartAdd = false;
let recommendationsCache = {};
let animationFrame = null;
let isInitialized = false;

if (cartIcon) {
  cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cart.classList.add('cd-drawer__open');
    document.body.style.overflow = 'hidden';
    
    if (!isInitialized) {
      initializeRecommendations();
      isInitialized = true;
    }
  });
}

async function changeQty(line, qty, btn, qtyInput, product) {
  try {
    const response = await fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: { [line]: qty } })
    });
    
    if (!response.ok) {
      throw new Error(`Cart update failed: ${response.status}`);
    }
  } catch (err) {
    console.error('[CartDrawer] Error updating cart:', err);
  } finally {
    const shouldLoadRecommendations = qty === 0;
    await rerenderCart(shouldLoadRecommendations);
    
    if (btn?.classList) {
      btn.classList.remove('loading');
    }
    if (product?.classList?.contains('item--loading')) {
      product.classList.remove('item--loading');
    }
  }
}

function updateBar() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  
  animationFrame = requestAnimationFrame(() => {
    const widths = document.querySelectorAll('.cd-free-shipping-bar__icon-d5');
    const bars = document.querySelectorAll('.cd-free-shipping-bar__inner-d5');

    widths.forEach((w, i) => {
      const width = w?.getAttribute('data-width');
      if (bars[i] && width) {
        bars[i].style.width = width;
      }
    });
  });
}

async function rerenderCart(shouldLoadRecommendations = false) {
  try {
    const response = await fetch('/cart');
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status}`);
    }
    
    const data = await response.text();
    const doc = new DOMParser().parseFromString(data, 'text/html');
    const oldElems = document.querySelectorAll('[render-d5]');
    const newElems = doc.querySelectorAll('[render-d5]');
    const oldIcon = document.querySelector('#cart-icon-bubble');
    const newIcon = doc.querySelector('#cart-icon-bubble');

    if (oldElems?.length && newElems?.length) {
      const minLength = Math.min(oldElems.length, newElems.length);
      for (let i = 0; i < minLength; i++) {
        if (oldElems[i] && newElems[i]) {
          oldElems[i].replaceWith(newElems[i]);
        }
      }
    }

    if (oldIcon && newIcon) {
      oldIcon.innerHTML = newIcon.innerHTML;
    }

    cart?.classList.remove('atc-loading-d5');
    
    if (shouldLoadRecommendations) {
      const productId = document.querySelector('.real-item-d5')?.getAttribute('data-product-id');
      const variantTitle = document.querySelector('.real-item-d5')?.getAttribute('data-variant-title');
      if (productId) {
        await loadRecommendedProducts(productId, variantTitle);
      }
    }
    
    updateBar();
  } catch (error) {
    console.error('[CartDrawer] Error rerendering cart:', error);
    cart?.classList.remove('atc-loading-d5');
  }
}

async function loadRecommendedProducts(productId, selectedTitle = null) {
  if (!productId) {
    console.warn('[CartDrawer] No product ID provided for recommendations');
    return;
  }
  
  try {
    const cacheKey = `${productId}_${selectedTitle || 'default'}`;
    
    if (recommendationsCache[cacheKey]) {
      renderRecommendations(recommendationsCache[cacheKey], selectedTitle);
      return;
    }

    const response = await fetch(`/recommendations/products.json?product_id=${productId}&limit=10`);
    if (!response.ok) {
      throw new Error(`Recommendations fetch failed: ${response.status}`);
    }
    
    const data = await response.json();

    if (data?.products?.length > 0) {
      recommendationsCache[cacheKey] = data.products;
      renderRecommendations(data.products, selectedTitle);
    } else {
      console.info('[CartDrawer] No recommendations available');
    }
  } catch (error) {
    console.error('[CartDrawer] Error loading recommendations:', error);
  }
}

function renderRecommendations(products, selectedTitle = null) {
  const container = document.getElementById('recommended-products-list');
  if (!container) {
    console.warn('[CartDrawer] Recommendations container not found');
    return;
  }

  const html = products.map(product => {
    const variant = product?.variants?.[0];
    if (!variant || !product) return ''; 
    
    const comparePrice = variant.compare_at_price > variant.price
      ? `<span class="cd-up-comp-price-d5">${formatMoney(variant.compare_at_price)}</span>`
      : '';
    const hasMultipleVariants = product.variants.length > 1;

    return `
      <div class="cd-up-item-d5" style="opacity: 0; transform: translateY(10px);">
        <a href="${product.url || '#'}" class="cd-up-img-d5">
          <img class="up-img-d5" src="${product.featured_image || ''}?width=200" width="80" height="80" alt="${escapeHtml(product.title || '')}" loading="lazy">
        </a>
        <div class="cd-up-item-content-d5">
          <h5><a href="${product.url || '#'}">${escapeHtml(product.title || '')}</a></h5>
          <div class="cd-up-price-d5">
            ${comparePrice}
            <span class="cd-up-reg-price-d5">${formatMoney(variant.price)}</span>
          </div>
          <form class="cd-up-form-d5" action="/cart/add" method="POST">
            <input type="hidden" value="1" name="quantity">
            <input type="hidden" value="${product.id || ''}" name="product-id">
            ${hasMultipleVariants
        ? `<select name="id" class="cd-up-variant-select-d5" data-variant-title="${escapeHtml(variant.title || '')}">
                ${product.variants.map(v =>
          `<option 
                    value="${v.id || ''}" 
                    ${!v.available ? 'disabled' : ''}
                    data-regular="${formatMoney(v.price || 0)}"
                    data-compare="${v.compare_at_price > v.price ? formatMoney(v.compare_at_price) : ''}"
                    ${v.featured_image ? `data-img="${v.featured_image.src}?width=200"` : ''}
                  >${escapeHtml(v.title || '')}</option>`
        ).join('')}
              </select>`
        : `<input type="hidden" value="${variant.id || ''}" name="id" data-variant-title="${escapeHtml(variant.title || '')}">`
      }
            <button name="add" type="submit">Add</button>
          </form>
        </div>
      </div>
    `;
  }).filter(Boolean).join('');

  container.innerHTML = html;

  requestAnimationFrame(() => {
    const items = container.querySelectorAll('.cd-up-item-d5');
    items.forEach((item, index) => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 50);
      });
    });
  });

  const slider = container.closest('.up-slider-d5');
  if (slider) {
    const row = slider.querySelector('.cd-up-row-d5');
    if (row) {
      requestAnimationFrame(() => {
        row.scrollTo({ left: 0, behavior: 'instant' });
      });
    }
  }

  if (selectedTitle) {
    container.querySelectorAll('.cd-up-variant-select-d5').forEach(select => {
      const matchingOption = Array.from(select.options).find(
        option => option.text.trim() === selectedTitle.trim() && !option.disabled
      );
      if (matchingOption) {
        select.value = matchingOption.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }
}

function formatMoney(cents) {
  const amount = typeof cents === 'number' ? cents : 0;
  return `$${(amount / 100).toFixed(2)}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.body.addEventListener('submit', async (e) => {
  const form = e.target;
  if (form.action && form.action.includes('/cart/add')) {
    e.preventDefault();
    
    if (form.classList.contains('processing') || isProcessingCartAdd) {
      return;
    }
    
    form.classList.add('processing');
    isProcessingCartAdd = true;
    
    const productId = form.querySelector('[name="product-id"]')?.value;
    const variantTitle = form.querySelector('[name="id"]')?.getAttribute('data-variant-title');
    const btn = form.querySelector('[name="add"]');
    
    if (btn) {
      btn.classList.add('loading');
    }

    if (cart) {
      cart.classList.add('cd-drawer__open', 'atc-loading-d5');
      document.body.style.overflow = 'hidden';
    }

    const contentEl = document.querySelector('.cd-content-d5');
    if (contentEl) {
      contentEl.scroll({ top: 0, behavior: 'smooth' });
    }

    try {
      const response = await fetch("/cart/add", {
        method: "POST",
        body: new FormData(form),
      });
      
      if (!response.ok) {
        throw new Error(`Cart add failed: ${response.status}`);
      }

      if (productId && variantTitle) {
        await loadRecommendedProducts(productId, variantTitle);
      }

      const shouldLoadRecommendations = !productId;
      await rerenderCart(shouldLoadRecommendations);
      
      cart?.classList.remove('atc-loading-d5');
      btn?.classList.remove('loading');
    } catch (error) {
      console.error('[CartDrawer] Error during form submission:', error);
      btn?.classList.remove('loading');
      cart?.classList.remove('atc-loading-d5');
    } finally {
      form.classList.remove('processing');
      isProcessingCartAdd = false;
      if (cart) {
        cart.classList.add('cd-drawer__open');
        document.body.style.overflow = 'hidden';
      }
    }
  }
});

document.body.addEventListener('click', (e) => {
  const qtyBtn = e.target.closest('.cd-qty-btn-d5');
  if (!qtyBtn) return;

  const product = qtyBtn.closest('.cd-item-d5');
  if (!product) return;

  const qtyInput = product.querySelector('.cd-qty-input-d5');
  if (!qtyInput) return;

  const max = parseInt(qtyInput.dataset.max) || 999;
  const line = product.getAttribute('data-line-item-key');
  let val = parseInt(qtyInput.value) || 1;
  
  if (!line) {
    console.warn('[CartDrawer] No line item key found');
    return;
  }

  if (qtyBtn.classList.contains('cd-plus-d5') && val < max) {
    qtyBtn.classList.add('loading');
    val++;
    changeQty(line, val, qtyBtn, qtyInput, product);
  } else if (qtyBtn.classList.contains('cd-minus-d5') && val > 1) {
    qtyBtn.classList.add('loading');
    val--;
    changeQty(line, val, qtyBtn, qtyInput, product);
  } else if (qtyBtn.classList.contains('cd-remove-d5')) {
    qtyBtn.classList.add('loading');
    val = 0;
    changeQty(line, val, qtyBtn, qtyInput, product);
    product.classList.add('item--loading');
  }
});

document.querySelectorAll('[close-cart-d5]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (cart?.classList.contains('cd-drawer__open')) {
      cart.classList.remove('cd-drawer__open');
    }
    document.body.style.overflow = '';
    document.body.classList.remove('overflow-hidden');
  });
});

document.body.addEventListener("click", async (e) => {
  const el = e.target.closest(".sp-t-sp-toggle-d5");
  if (!el) return;

  if (el.classList.contains('loading')) {
    return;
  }

  const variantId = el.dataset.variant;
  const key = el.getAttribute("key");
  
  if (!variantId) {
    console.warn('[CartDrawer] No variant ID found for toggle');
    return;
  }

  const shouldRemove = el.classList.contains("active");
  el.classList.add("loading");

  try {
    if (shouldRemove) {
      if (!key) {
        throw new Error('No key found for removal');
      }
      const res = await fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key, quantity: 0 })
      });
      if (!res.ok) throw new Error(`Remove failed: ${res.status}`);
    } else {
      el.classList.add("active");
      const res = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      });
      if (!res.ok) throw new Error(`Add failed: ${res.status}`);
    }

    await rerenderCart(false);
  } catch (err) {
    console.error("[CartDrawer] SP Toggle Error:", err);
    el?.classList.remove("loading");
  }
});

document.body.addEventListener('change', (e) => {
  const select = e.target.closest('.cd-up-variant-select-d5');
  if (!select) return;

  const selectedOption = select.options[select.selectedIndex];
  if (!selectedOption) return;
  
  const upItem = select.closest('.cd-up-item-d5');
  if (!upItem) return;

  requestAnimationFrame(() => {
    const regularPrice = selectedOption.getAttribute('data-regular');
    const priceElement = upItem.querySelector('.cd-up-reg-price-d5');
    if (priceElement && regularPrice) {
      priceElement.textContent = regularPrice;
    }

    const comparePrice = selectedOption.getAttribute('data-compare');
    const comparePriceElement = upItem.querySelector('.cd-up-comp-price-d5');
    if (comparePriceElement) {
      comparePriceElement.textContent = comparePrice || '';
    }

    const imgUrl = selectedOption.getAttribute('data-img');
    const imgElement = upItem.querySelector('.up-img-d5');
    if (imgUrl && imgElement) {
      imgElement.src = imgUrl;
    }

    select.setAttribute('data-variant-title', selectedOption.textContent);
  });
});

document.body.addEventListener('click', (e) => {
  const leftBtn = e.target.closest('.up-left-btn-d5');
  const rightBtn = e.target.closest('.up-right-btn-d5');
  
  if (!leftBtn && !rightBtn) return;

  const container = (leftBtn || rightBtn).closest('.up-slider-d5');
  if (!container) return;

  const row = container.querySelector('.cd-up-row-d5');
  const items = row?.querySelectorAll('.cd-up-item-d5');
  if (!items || items.length === 0) return;

  const direction = leftBtn ? -1 : 1;
  const itemWidth = items[0].offsetWidth;
  const gap = 0;
  const scrollAmount = itemWidth + gap;
  const maxScroll = row.scrollWidth - row.clientWidth;
  let newScroll = row.scrollLeft + (direction * scrollAmount);

  if (direction > 0 && newScroll >= maxScroll) {
    newScroll = 0;
  } else if (direction < 0 && newScroll <= 0) {
    newScroll = maxScroll;
  }

  row.scrollTo({
    left: newScroll,
    behavior: 'smooth'
  });
});

async function autoRemoveSp(sele) {
  if (!sele) return;
  
  const autoEl = sele.querySelector('.sp-t-sp-toggle-d5.nt-remove-d5');
  if (!autoEl) return;
  
  const key = autoEl.getAttribute('key');
  if (!key) return;
  
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
      await rerenderCart(false);
    }
  } catch (error) {
    console.error('[CartDrawer] Auto remove error:', error);
    autoEl.classList.remove('loading');
  }
}

function detectCartAdd() {
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const [url, options] = args;

    return originalFetch.apply(this, args).then(async response => {
      if (url && url.includes('/cart/add') && options?.method === 'POST' && !isProcessingCartAdd) {
        const clonedResponse = response.clone();
        try {
          await clonedResponse.json();
          if (cart) {
            cart.classList.add('cd-drawer__open', 'atc-loading-d5');
            document.body.style.overflow = 'hidden';
          }
          await rerenderCart(true);
        } catch (e) {
          console.error('[CartDrawer] Error in detectCartAdd fetch:', e);
        }
      }
      return response;
    });
  };

  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url;
    this._method = method;
    return originalXHROpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (this._url && this._url.includes('/cart/add') && this._method === 'POST' && !isProcessingCartAdd) {
      this.addEventListener('load', async function () {
        try {
          JSON.parse(this.responseText);
          if (cart) {
            cart.classList.add('cd-drawer__open', 'atc-loading-d5');
            document.body.style.overflow = 'hidden';
          }
          await rerenderCart(true);
        } catch (e) {
          console.error('[CartDrawer] Error in detectCartAdd XHR:', e);
        }
      });
    }
    return originalXHRSend.apply(this, args);
  };
}

detectCartAdd();

function initializeRecommendations() {
  const productId = document.querySelector('.real-item-d5')?.getAttribute('data-product-id');
  const variantTitle = document.querySelector('.real-item-d5')?.getAttribute('data-variant-title');

  if (productId) {
    loadRecommendedProducts(productId, variantTitle);
  } else {
    const FALLBACK_PID = 9116780986676;
    loadRecommendedProducts(FALLBACK_PID);
  }
}

function initTooltip() {
  const box = document.querySelector('.cd-info-box-d5');
  const button = document.querySelector('.cd-info-tool-tip');
  const closeBtn = document.querySelector('.cd-info-close-d5');
  
  if (!button || !box || !closeBtn) {
    return;
  }
  
  let tooltipTimeout;
  
  button.addEventListener('click', () => {
    box.classList.toggle('active');

    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }

    if (box.classList.contains('active')) {
      tooltipTimeout = setTimeout(() => {
        box.classList.remove('active');
      }, 5000);
    }
  });

  closeBtn.addEventListener('click', () => {
    box.classList.remove('active');
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }
  });
}

initTooltip();

console.log('[CartDrawer] Initialized successfully');
} })();