const orders = document.getElementById("orders");
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");


/* ===== ORDER BOX FUNC ===== */
if (!userId) {
  orders.innerHTML = "<p class=no-login>Please login</p>";
} else {
  fetch(`http://localhost:5000/api/orders/${userId}`)
    .then(res => res.json())
    .then(data => {
      data.forEach(order => {
  const div = document.createElement("div");

  const date = new Date(order.createdAt);
  const formatted = date.toLocaleString("en-IN", {
  dateStyle: "medium",
  timeStyle: "short"
});
  

  div.innerHTML = `
    <div class="order-card">
      <div class="order-details">
        <p class="label">ORDER ID:</p>
        <h3 class="id">${order._id}</h3>
        <p class="label">DATE PLACED:</p>
        <h3 class="date">${formatted}</h3>
      </div>
      <div class="order-summary">
        <p class="label">TOTAL:</p>
        <h3 class="total">${order.totalAmount}DHS</h3>
        <div class="status">Status: <span>${order.status}</span></div>
      </div>
    </div>
  `;

  orders.appendChild(div);
});
});
}
