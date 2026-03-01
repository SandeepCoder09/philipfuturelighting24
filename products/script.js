document.addEventListener("DOMContentLoaded", initProductsPage);

/* =====================================================
   BACKEND BASE (SAFE)
===================================================== */

// Remove /api only if it exists at the end
const BACKEND_BASE = API_BASE.endsWith("/api")
  ? API_BASE.slice(0, -4)
  : API_BASE;

/* =====================================================
   INIT & AUTH CHECK
===================================================== */

async function initProductsPage() {

  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    
    const response = await authFetch("/users/profile");

    if (!response.ok) {
      redirectToLogin();
      return;
    }

    await loadProducts();

  } catch (error) {
    redirectToLogin();
  }
}

function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "../auth/index.html";
}

/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

  const container = document.getElementById("productsContainer");
  if (!container) return;

  container.innerHTML = "";

  try {

    const res = await authFetch("/products/list");
    if (!res.ok) {
      console.error("Failed to load products");
      return;
    }

    const products = await res.json();

    products.forEach(product => {

      const card = document.createElement("div");
      card.className = "card";
      card.dataset.productId = product.code;

      const isLimitReached = product.remaining <= 0;

      card.innerHTML = `
        <div class="card-image">
          <img 
            src="${BACKEND_BASE}/uploads/${product.image}" 
            alt="${product.name}"
            loading="lazy"
          >
        </div>

        <div class="card-content">
          <div class="card-text">
            <h2>${product.name}</h2>
            <p class="price">Price: ₹${product.price}</p>
            <p class="daily-earning">Daily Income: ₹${product.dailyIncome}</p>
            <p class="validity">Validity: ${product.validityDays} Days</p>
            <p class="limit">
              Remaining: ${product.remaining} / ${product.maxPurchaseLimit}
            </p>
          </div>

          <div class="card-action">
            <button 
              class="subscribe-btn"
              ${isLimitReached ? "disabled" : ""}
            >
              ${
                isLimitReached
                  ? "Limit Reached"
                  : `<i class="fa-solid fa-cart-shopping"></i> Buy`
              }
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    setupBuyButtons();

  } catch (err) {
    console.error("Error loading products", err);
  }
}


/* =====================================================
   BUY LOGIC
===================================================== */

function setupBuyButtons() {

  const buyButtons = document.querySelectorAll(".subscribe-btn");

  buyButtons.forEach(button => {

    if (button.disabled) return;

    button.addEventListener("click", async function () {

      const card = this.closest(".card");
      if (!card) return;

      const productId = card.dataset.productId;

      showLoading();

      try {


        const response = await authFetch("/products/buy", {
          method: "POST",
          body: JSON.stringify({ productId })
        });

        const data = await response.json();
        hideLoading();

        if (!response.ok) {
          showError(data.message || "Purchase failed.");
          return;
        }

        showSuccess(data.remainingBalance);

        // Reload to update remaining limit
        await loadProducts();

      } catch (error) {
        hideLoading();
        showError("Network error. Please try again.");
      }
    });

  });
}


/* =====================================================
   UI HELPERS
===================================================== */

function showLoading() {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) loadingScreen.classList.add("active");
}

function hideLoading() {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) loadingScreen.classList.remove("active");
}

function showSuccess(balance) {

  const successPopup = document.getElementById("successPopup");
  if (!successPopup) return;

  const messageEl = document.getElementById("successMessage");

  if (messageEl && balance !== undefined) {
    messageEl.innerHTML =
      `Your earning has started successfully.<br>
       Remaining Balance: <b>₹${balance}</b>`;
  }

  successPopup.classList.add("active");
}

function showError(message) {

  const errorPopup = document.getElementById("errorPopup");
  if (!errorPopup) return;

  const messageEl = document.getElementById("errorMessage");

  if (messageEl && message) {
    messageEl.innerText = message;
  }

  errorPopup.classList.add("active");
}

function closePopup() {
  const successPopup = document.getElementById("successPopup");
  if (successPopup) successPopup.classList.remove("active");
}

function closeErrorPopup() {
  const errorPopup = document.getElementById("errorPopup");
  if (errorPopup) errorPopup.classList.remove("active");
}

function goToMyProducts() {
  window.location.href = "my-products.html";
}

function goToRecharge() {
  window.location.href = "../wallet/recharge.html";
}

window.closePopup = closePopup;
window.goToMyProducts = goToMyProducts;
window.closeErrorPopup = closeErrorPopup;
window.goToRecharge = goToRecharge;

