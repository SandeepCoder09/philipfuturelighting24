document.addEventListener("DOMContentLoaded", initProductsPage);

/* =====================================================
   INIT & PROTECT PAGE
===================================================== */
async function initProductsPage() {

  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    // 🔒 Verify token with backend
    const response = await authFetch("/users/profile");

    if (!response.ok) {
      redirectToLogin();
      return;
    }

    // If valid → enable buy buttons
    setupBuyButtons();

  } catch (error) {
    redirectToLogin();
  }
}

function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "../auth/index.html";
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

  const messageEl = successPopup.querySelector("p");

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

  const messageEl = errorPopup.querySelector("p");

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
  window.location.href = "../products/my-products.html";
}

function goToRecharge() {
  window.location.href = "../wallet/recharge.html";
}


/* =====================================================
   BUY LOGIC
===================================================== */

function setupBuyButtons() {

  const buyButtons = document.querySelectorAll(".subscribe-btn");

  buyButtons.forEach(button => {

    button.addEventListener("click", async function () {

      const card = this.closest(".card");
      if (!card) return;

      const nameEl = card.querySelector("h2");
      const priceEl = card.querySelector(".price");
      const earningEl = card.querySelector(".daily-earning");

      if (!nameEl || !priceEl || !earningEl) {
        showError("Invalid product data.");
        return;
      }

      const name = nameEl.innerText.trim();
      const price = parseInt(priceEl.innerText.replace(/[^0-9]/g, ""));
      const earning = parseInt(
        earningEl.innerText.replace(/[^0-9]/g, "")
      );

      if (isNaN(price) || isNaN(earning)) {
        showError("Invalid product data.");
        return;
      }





      showLoading();

      try {

        // 🔥 Use authFetch instead of fetch
        const response = await authFetch("/products/buy", {
          method: "POST",

          body: JSON.stringify({
            name,
            price,
            dailyEarning: earning
          })
        });

        const data = await response.json();
        hideLoading();

        if (!response.ok) {
          showError(data.message || "Purchase failed.");
          return;
        }

        showSuccess(data.remainingBalance);

      } catch (error) {
        hideLoading();
        showError("Network error. Please try again.");
      }
    });

  });
}


/* =====================================================
   GLOBAL EXPORTS
===================================================== */

window.closePopup = closePopup;
window.goToMyProducts = goToMyProducts;
window.closeErrorPopup = closeErrorPopup;
window.goToRecharge = goToRecharge;

