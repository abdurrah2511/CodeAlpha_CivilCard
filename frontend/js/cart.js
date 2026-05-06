const cartContainer = document.getElementById("cart");
const totalDisplay = document.getElementById("totally");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ===== CART PRODUCTS ===== */
function renderCart() {
  const summaryDisplay = document.querySelector(".summary-card"); 
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-message">
        <p>Currently your cart is empty, add items.</p>
      </div>
    `;
    
    if (summaryDisplay) {
      summaryDisplay.innerHTML = "";
      summaryDisplay.style.display = "none";
    }
    return;
  }

  cartContainer.innerHTML = "";
  if (summaryDisplay) summaryDisplay.style.display = "block"; 
  
  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    totalItems += item.quantity;

    const div = document.createElement("div");

    div.style.setProperty('--item-color', item.color || '#ccc');

    div.innerHTML = `
    <div class="cart-card">
      <div class="card-img">
        <img src="${item.image}" alt="${item.name}"/>
      </div>
      <div class="card-details">
        <p class="team">${item.team}</p>
        <h2>${item.name}</h2>
        <p class="rank">RANK : <span>${item.rarity || 'RARE'}</span></p> 
        <br/>
        <p class="rank">QUANTITY : <span>${item.quantity}</span></p>
        <button onclick="removeItem(${index})" class="remove-btn">REMOVE</button>
      </div>
      <div class="card-price-tag">
        <p>PRICE:</p>
        <p class="price-val"> ${item.price} DHS</p>
      </div>
    </div>
    `;
    cartContainer.appendChild(div);
  });

  if (summaryDisplay) {
    summaryDisplay.innerHTML = `
      <h3>ORDER SUMMARY</h3>
      <div class="summary-divider"></div>
      <div class="summary-row">
          <span>SUBTOTAL ( ${totalItems} ITEMS )</span>
          <span>${total.toFixed(2)}</span>
      </div>
      <div class="summary-row">
          <span>DELIVERY ( SECURE MAIL )</span>
          <span>FREE</span>
      </div>
      <div class="summary-row">
          <span>TAX ( VAT )</span>
          <span>00.00</span>
      </div>
      <div class="summary-divider"></div>
      <div class="total-row">
          <span class="total-label">TOTAL CREDITS:</span>
          <span class="total-value">${total.toFixed(2)} DHS</span>
      </div>
      <button onclick="checkout()" class="checkout-btn">CHECKOUT</button>
    `;
  }
}

/* ===== ITEM REMOVE FROM CART ===== */
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* ===== CHECOUT FUNC ===== */
function checkout() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Please login first");
    return;
  }

  const items = cart.map(item => ({
    productId: item._id,
    quantity: item.quantity
  }));

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      items,
      totalAmount
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Order placed & saved 🎉");
      localStorage.removeItem("cart");
      renderCart();
    });
}

renderCart();