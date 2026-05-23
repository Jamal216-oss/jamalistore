document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const productSearch = document.getElementById("productSearch");
  const productGrid = document.getElementById("productGrid");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      siteNav.classList.toggle("open");
      const expanded = siteNav.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", expanded.toString());
    });
  }

  if (productSearch && productGrid) {
    productSearch.addEventListener("input", function (event) {
      const query = event.target.value.toLowerCase();
      const cards = productGrid.querySelectorAll(".product-card");

      cards.forEach((card) => {
        const name = card.getAttribute("data-name") || "";
        const category = card.getAttribute("data-category") || "";
        const visible = name.toLowerCase().includes(query) || category.toLowerCase().includes(query);
        card.style.display = visible ? "grid" : "none";
      });
    });
  }

  const productButtons = document.querySelectorAll(".product-action");
  productButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = button.closest(".product-card");
      const name = card?.getAttribute("data-name") || "product";
      alert(`You selected: ${name}. Visit the product page to buy it soon!`);
    });
  });
});

// --- gallery and request modal logic ---
document.addEventListener("DOMContentLoaded", function () {
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true">
        <button class="close-modal" style="float:right">Close</button>
        <div class="gallery-main"><img src="" alt="gallery main" /></div>
        <div class="gallery-thumbs"></div>
        <hr />
        <div class="request-container" style="display:none">
          <form class="request-form">
            <h3>Request product</h3>
            <label>Product</label>
            <input name="product" readonly />
            <label>Your name</label>
            <input name="name" placeholder="Your full name" required />
            <label>Phone</label>
            <input name="phone" placeholder="+255..." required />
            <label>Message</label>
            <textarea name="message" rows="3" placeholder="Request details, size, variant..."></textarea>
            <div class="contact-block">Phone: +255678179280 • Email: jamaliswalehe60@gmail.com</div>
            <div class="request-row">
              <button type="submit" class="btn btn-primary">Send request</button>
            </div>
          </form>
        </div>
      </div>`;

    document.body.appendChild(modal);
    return modal;
  }

  const modal = createModal();
  const modalContent = modal.querySelector('.modal-content');
  const galleryMainImg = modal.querySelector('.gallery-main img');
  const galleryThumbs = modal.querySelector('.gallery-thumbs');
  const requestContainer = modal.querySelector('.request-container');
  const closeModalBtn = modal.querySelector('.close-modal');

  function openGallery(images, title) {
    requestContainer.style.display = 'none';
    galleryThumbs.innerHTML = '';
    const list = images.split(',').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return;
    galleryMainImg.src = list[0];
    galleryMainImg.alt = title;
    list.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      if (i === 0) img.classList.add('active');
      img.addEventListener('click', () => {
        galleryMainImg.src = src;
        galleryThumbs.querySelectorAll('img').forEach(n => n.classList.remove('active'));
        img.classList.add('active');
      });
      galleryThumbs.appendChild(img);
    });
    modal.classList.add('open');
  }

  function openRequest(productName, priceText) {
    galleryThumbs.innerHTML = '';
    galleryMainImg.src = '';
    requestContainer.style.display = '';
    const form = requestContainer.querySelector('.request-form');
    form.product.value = productName + (priceText ? ` — ${priceText}` : '');
    modal.classList.add('open');
  }

  closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // wire gallery buttons
  document.querySelectorAll('.product-gallery').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      const images = card.getAttribute('data-images') || '';
      const name = card.getAttribute('data-name') || '';
      openGallery(images, name);
    });
  });

  // wire request buttons
  document.querySelectorAll('.product-request').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      const name = card.getAttribute('data-name') || '';
      // if variant select exists, include selected price
      const variant = card.querySelector('.variant-select');
      let priceText = '';
      if (variant) {
        const opt = variant.options[variant.selectedIndex];
        priceText = opt ? opt.text : '';
      } else {
        const priceNode = card.querySelector('.price');
        priceText = priceNode ? priceNode.textContent : '';
      }
      openRequest(name, priceText);
    });
  });

  // submit handler: open mailto with prefilled body and also show contact phone
  const requestForm = modal.querySelector('.request-form');
  requestForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const data = new FormData(requestForm);
    const product = data.get('product');
    const name = data.get('name');
    const phone = data.get('phone');
    const message = data.get('message');
    const subject = encodeURIComponent(`Product request: ${product}`);
    const body = encodeURIComponent(`Product: ${product}\nName: ${name}\nPhone: ${phone}\nMessage:\n${message}\n\nContact phone: +255678179280`);
    const mailto = `mailto:jamaliswalehe60@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    // keep modal open so user can see contact
  });

  // update price display when variant changes
  document.querySelectorAll('.variant-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const card = select.closest('.product-card');
      const priceText = select.options[select.selectedIndex].text;
      const priceNode = card.querySelector('.price');
      if (priceNode) priceNode.textContent = priceText.split(' — ').pop();
    });
  });
});
