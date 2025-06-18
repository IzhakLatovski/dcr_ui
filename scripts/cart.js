const cartItems = [];

function addToCart(card) {
  if (cartItems.some((item) => item.name === card.name)) {
    showToast(`${card.name} is already in the cart.`);
    return;
  }
  cartItems.push(card);
  updateCartUI();
  showToast(`${card.name} added to cart.`);
}

function removeFromCart(name) {
  const index = cartItems.findIndex((item) => item.name === name);
  if (index !== -1) {
    const removed = cartItems.splice(index, 1)[0];
    updateCartUI();
    showToast(`${removed.name} removed from cart.`);
  } else {
    showToast(`${name} is not in the cart.`);
  }
}

function clearCart() {
  cartItems.length = 0;
  updateCartUI();
  showToast("Cart cleared.");
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const summaryEl = document.getElementById("cart-summary");
  const contentsEl = document.getElementById("cart-contents");

  const totalPoints = cartItems.reduce((sum, item) => sum + item.points, 0);

  countEl.textContent = cartItems.length;
  summaryEl.textContent = `${cartItems.length} items / ${totalPoints} pts`;

  contentsEl.innerHTML = "";

  if (cartItems.length === 0) {
    contentsEl.innerHTML = `<p style="text-align:center; color:gray;">Cart is empty.</p>`;
    return;
  }

  cartItems.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-row">
        <span>${item.name}</span>
        <button class="remove-btn" data-name="${item.name}">&times;</button>
      </div>
      <div class="cart-item-points">${item.points} pts</div>
    `;
    contentsEl.appendChild(div);
  });

  contentsEl.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.getAttribute("data-name"));
    });
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("visible"), 10);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.getElementById("cart-icon").addEventListener("click", () => {
  document.getElementById("cart-menu").classList.toggle("open");
});

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-circle")) {
    event.stopPropagation();
    const cardEl = event.target.closest(".card");
    const name = cardEl.querySelector("h2").textContent;
    const points = parseInt(
      cardEl.querySelector(".points-text").textContent.match(/\d+/)[0]
    );
    const img = cardEl.querySelector("img").src;

    addToCart({ name, points, image: img });
  }
});
