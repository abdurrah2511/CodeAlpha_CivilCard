/* ===== GLOBAL VARIABLES ===== */
const container = document.getElementById("products");
let allProducts = []; // To store data from API
let carouselProducts = [];
let currentIdx = 0;
let carouselInterval;

/* ===== STARTING API ===== */
function init() {
  // Check which page we are currently on
  const isSingleProductPage = window.location.pathname.includes("product-single.html");

  if (isSingleProductPage) {
    loadProductDetail();
  }

  /* ==== COLLECTING PRODUCT DATA FROM SERVER/DB ====*/
  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      
      const isHomePage = window.location.pathname.includes("index.html");
      const params = new URLSearchParams(window.location.search);
      const teamFilter = params.get("team");

      if (isHomePage) {
        // Show only first 4 on home page
        displayProducts(data.slice(0, 4)); 
        carouselProducts = data.slice(0, 5); 
        renderHeroCarousel();
        startAutoRotate();
      } else if (teamFilter) {
        // Filter by team if URL has ?team=...
        const filteredByTeam = allProducts.filter(p => p.team === teamFilter);
        displayProducts(filteredByTeam);
      } else {
        displayProducts(data);
      }
    })
    .catch(err => {
      console.log("Something went wrong with the fetch:");
      console.error(err);
    });
}

/* ===ALL DETAILS OF PRODUCT ==== */
function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const productContainer = document.getElementById("product");

  if (!id || !productContainer) return;

  fetch("http://localhost:5000/api/products/" + id)
    .then(res => res.json())
    .then(product => {
      document.title = product.name;
      
      productContainer.style.setProperty('--item-color', product.color || '#ccc');

      productContainer.innerHTML = `
        <nav class="breadcrumb">
            <a href="index.html">Home</a> > <a href="collections.html">Collections</a> > <span>${product.name}</span>
        </nav>
        <div class="product-card">
            <div class="card-image">
                <img class="hero-image" src="${product.image}" alt="${product.name}">
            </div>
            <div class="card-details">
                <header>
                    <h1>${product.title}</h1>
                    <p class="subtitle">${product.name}</p>
                </header>
                <div class="divider"></div>
                <p class="description">${product.description}</p>
                <div class="divider"></div>
                <div class="stats">
                    <p>TEAM: <span>${product.team}</span></p>
                    <p>RANK: <span>${product.rarity}</span></p>
                </div>
                <div class="price-section">
                    <div class="price">${product.price}<span>DHS</span></div>
                    <p class="vat">All Price Included VAT</p>
                </div>
                <div class="divider"></div>
                <button onclick="addToCart('${product._id}')" class="add-to-cart">ADD TO CART</button>
            </div>
        </div>
      `;
    })
    .catch(err => console.error("Error loading product:", err));
}

/* ==== DISPLAYING PRODUCTS ===== */
function displayProducts(products) {
  if (!container) return;
  container.innerHTML = ""; // Clear existing cards

  products.forEach(product => {
    const div = document.createElement("div");
    
    div.style.setProperty('--item-color', product.color || '#ccc');

    div.innerHTML = `
      <div class="card-item">
        <div class="card-visual">
          <img src="${product.image}" alt="${product.name}"/>
        </div>
        <div class="card-divider"></div>
        <div class="card-info">
          <div class="card-text">
             <h3>${product.title}</h3>
             <p class="subtitle">${product.name}</p>
          </div>
          <div class="card-price">${product.price}</div>
        </div>
        <div class="card-divider"></div>
        <div class="card-actions">
           <button onclick="addToCart('${product._id}')" class="btn-add">ADD TO CART</button>
           <button onclick="viewProduct('${product._id}')" class="btn-view">VIEW ITEM</button>
         </div>
      </div>
    `;
    container.appendChild(div);
  });
}

/* ==== HERO CAROUSEL SECTION ==== */
function renderHeroCarousel() {
  const stage = document.getElementById("cardStage");
  if (!stage) return;

  let carouselHTML = "";
  
  carouselProducts.forEach((product, i) => {
    let positionClass = "hidden";
    if (i === 0) positionClass = "active";
    if (i === 1) positionClass = "next";
    if (i === carouselProducts.length - 1) positionClass = "prev";

    carouselHTML += `
      <div class="card ${positionClass}">
        <div class="card-header">
          <span class="rank-badge" style="background-color: ${product.color || '#dc2626'}">
            ${product.rarity.toUpperCase()}
          </span>
        </div>
        <div class="hero-img-container">
            <img src="${product.image}" alt="${product.name}" class="hero-main-img">
        </div>
        <div class="card-footer">
          <h2 class="hero-card-title">${product.name.toUpperCase()}</h2>
          <p class="protocol">${product.title}</p>
          <button onclick="viewProduct('${product._id}')" class="carousel-view-btn"> VIEW MORE </button>
        </div>
      </div>
    `;
  });
  
  stage.innerHTML = carouselHTML;
}

function rotate(dir) {
  const cards = document.querySelectorAll('#cardStage .card');
  if (cards.length === 0) return;

  currentIdx = (currentIdx + dir + cards.length) % cards.length;
  
  for (let i = 0; i < cards.length; i++) {
    cards[i].className = "card hidden"; // Reset all
    
    if (i === currentIdx) {
      cards[i].className = "card active";
    } else if (i === (currentIdx + 1) % cards.length) {
      cards[i].className = "card next";
    } else if (i === (currentIdx - 1 + cards.length) % cards.length) {
      cards[i].className = "card prev";
    }
  }
}

/* ===== AUTO ROTATE CAROUSEL ===== */
function startAutoRotate() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(function() {
        rotate(1);
    }, 5000);
}

/* ===== SEARCH ===== */
let selectedTeam = ""; 

function applyFilters() {
  const searchInput = document.getElementById("search");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

  const filtered = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesTeam = (selectedTeam === "" || product.team === selectedTeam);
    return matchesSearch && matchesTeam;
  });

  displayProducts(filtered);
}

/* ===== FILTER ===== */
function filterByTeam(team) {
  selectedTeam = team;
  
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    if (btn.innerText.includes(team) || (team === "" && btn.innerText === "ALL CARDS")) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  applyFilters();
}

/* ==== CURSOR ===== */
const dot = document.createElement("div");
const outline = document.createElement("div");
dot.className = "cursor-dot";
outline.className = "cursor-outline";
document.body.appendChild(dot);
document.body.appendChild(outline);

window.addEventListener("mousemove", function(e) {
    // Simple positioning
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    
    setTimeout(() => {
        outline.style.left = (e.clientX - 20) + "px";
        outline.style.top = (e.clientY - 20) + "px";
    }, 50);
});

/* ===== ADD TO CART ===== */
function addToCart(productId) {
  const product = allProducts.find(p => p._id === productId);
  
  if (!product) {
    // If not found (maybe page refreshed), fetch from API
    fetch("http://localhost:5000/api/products/" + productId)
      .then(res => res.json())
      .then(fetchedProduct => saveToCart(fetchedProduct));
  } else {
    saveToCart(product);
  }
}

function saveToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item._id === product._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(product.name + " added to cart!");
}

function viewProduct(id) {
  window.location.href = "product-single.html?id=" + id;
}

function logout() {
  localStorage.clear();
  alert("You have logged out.");
  window.location.href = "index.html";
}

/* ===== ON LOAD ===== */
window.onload = function() {
  init();

  // Check login status from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const authSection = document.getElementById("authSection");
  const userSection = document.getElementById("userSection");
  const usernameDisplay = document.getElementById("username");

  if (token && username) {
    if (authSection) authSection.style.display = "none";
    if (userSection) userSection.style.display = "inline";
    if (usernameDisplay) usernameDisplay.innerText = username.toUpperCase();
  }

  const searchBar = document.getElementById("search");
  if (searchBar) {
    searchBar.addEventListener("input", applyFilters);
  }
};