document.addEventListener("DOMContentLoaded", initProductsPage);

/* =====================================================
   BACKEND BASE (SAFE)
===================================================== */


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
    if (!res.ok) return;

    const products = await res.json();

    products.forEach(product => {

      const card = document.createElement("div");
      card.className = "card";


      const isLimitReached = product.remaining <= 0;
      const isComingSoon = product.code === "PH99999";

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
            <p class="daily-earning">Daily: ₹${product.dailyIncome}</p>
            <p class="validity">Validity: ${product.validityDays} Days</p>
            <p class="limit">
              Remaining: ${product.remaining} / ${product.maxPurchaseLimit}
            </p>
          </div>

          <div class="card-action">
            <button 
  class="subscribe-btn ${isComingSoon ? "coming-soon-btn" : ""}"
  ${isLimitReached ? "disabled" : ""}
>
  ${isComingSoon
          ? "Coming Soon"
          : isLimitReached
            ? "Limit Reached"
            : `<i class="fa-solid fa-cart-shopping"></i> Buy`
        }
</button>
          </div>
        </div>
      `;


      container.appendChild(card);

      if (!isLimitReached && !isComingSoon) {
        const buyBtn = card.querySelector(".subscribe-btn");
        buyBtn.addEventListener("click", () => openBuyModal(product));
      }
    });

  } catch (err) {
    console.error("Load products error:", err);
  }
}

/* =====================================================
   PRODUCT DETAIL MODAL
===================================================== */

let selectedProductCode = null;

function openBuyModal(product) {

  selectedProductCode = product.code;

  document.getElementById("modalProductName").innerText = product.name;
  document.getElementById("modalPrice").innerText = product.price;
  document.getElementById("modalDaily").innerText = product.dailyIncome;
  document.getElementById("modalValidity").innerText = product.validityDays;
  document.getElementById("modalRemaining").innerText = product.remaining;

  const totalReturn = product.dailyIncome * product.validityDays;
  document.getElementById("modalTotal").innerText = totalReturn;

  const imageUrl = product.image
    ? `${BACKEND_BASE}/uploads/${product.image}`
    : `${BACKEND_BASE}/uploads/default-product.png`;

  document.getElementById("modalImage").src = imageUrl;

  document.getElementById("buyModal").classList.add("active");
}

/* =====================================================
   BUY CONFIRM
===================================================== */

document.getElementById("buyCloseBtn").onclick = () => {
  document.getElementById("buyModal").classList.remove("active");
};

document.getElementById("confirmBuyBtn").onclick = async () => {

  if (!selectedProductCode) return;

  document.getElementById("buyModal").classList.remove("active");
  showLoading();

  try {

    const response = await authFetch("/products/buy", {
      method: "POST",
      body: JSON.stringify({ productId: selectedProductCode })
    });

    const data = await response.json();

    hideLoading();

    if (data.success) {

      showActionModal(
        "Purchase Successful",
        "Your earning has started successfully.",
        "My Products",
        () => window.location.href = "my-products.html"
      );

      await loadProducts();

    } else {

      if (data.message === "Insufficient Balance") {

        showActionModal(
          "Insufficient Balance",
          "Your wallet balance is too low.",
          "Recharge",
          () => window.location.href = "../wallet/recharge.html"
        );

      } else {

        showActionModal(
          "Error",
          data.message || "Something went wrong.",
          "OK",
          closeActionModal
        );
      }
    }

  } catch (err) {

    hideLoading();

    showActionModal(
      "Error",
      "Network error. Please try again.",
      "OK",
      closeActionModal
    );
  }
};

/* =====================================================
   ACTION MODAL
===================================================== */

function showActionModal(title, message, rightBtnText, rightAction) {

  document.getElementById("actionTitle").innerText = title;
  document.getElementById("actionMessage").innerText = message;

  const rightBtn = document.getElementById("actionRightBtn");
  rightBtn.innerText = rightBtnText;
  rightBtn.onclick = rightAction;

  document.getElementById("actionModal").classList.add("active");
}

function closeActionModal() {
  document.getElementById("actionModal").classList.remove("active");
}

document.getElementById("actionCloseBtn").onclick = closeActionModal;

/* =====================================================
   LOADING
===================================================== */

function showLoading() {
  document.getElementById("loadingScreen").classList.add("active");
}

function hideLoading() {
  document.getElementById("loadingScreen").classList.remove("active");
}

// Test