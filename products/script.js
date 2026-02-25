document.addEventListener("DOMContentLoaded", function () {

  const API = "https://philips-backend.onrender.com/api";

  const loadingScreen = document.getElementById("loadingScreen");
  const successPopup = document.getElementById("successPopup");
  const errorPopup = document.getElementById("errorPopup");
  const buyButtons = document.querySelectorAll(".subscribe-btn");

  /* ================= UI HELPERS ================= */

  function showLoading() {
    if (loadingScreen) loadingScreen.classList.add("active");
  }

  function hideLoading() {
    if (loadingScreen) loadingScreen.classList.remove("active");
  }

  function showSuccess(balance) {
    if (!successPopup) return;

    const messageEl = successPopup.querySelector("p");
    if (messageEl && balance !== undefined) {
      messageEl.innerHTML =
        `Your earning has started successfully.<br>
         Remaining Balance: <b>₹${balance}</b>`;
    }

    successPopup.classList.add("active");
  }

  function closePopup() {
    if (successPopup) successPopup.classList.remove("active");
  }

  function showError(message) {
    if (!errorPopup) return;

    const messageEl = errorPopup.querySelector("p");
    if (messageEl && message) {
      messageEl.innerText = message;
    }

    errorPopup.classList.add("active");
  }

  function closeErrorPopup() {
    if (errorPopup) errorPopup.classList.remove("active");
  }

  function goToMyProducts() {
    window.location.href = "../products/my-products.html";
  }

  function goToRecharge() {
    window.location.href = "../wallet/recharge.html";
  }

  /* ================= BUY LOGIC ================= */

  buyButtons.forEach(button => {
    button.addEventListener("click", async function () {

      const card = this.closest(".card");
      if (!card) return;

      const nameEl = card.querySelector("h2");
      const priceEl = card.querySelector(".price");
      const earningEl = card.querySelector(".daily-earning");

      if (!nameEl || !priceEl || !earningEl) return;

      const name = nameEl.innerText.trim();
      const price = parseInt(priceEl.innerText.replace(/[^0-9]/g, ""));
      const earning = parseInt(
  earningEl.innerText.replace(/[^0-9]/g, "")
);
      if (isNaN(price) || isNaN(earning)) {
        showError("Invalid product data.");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        showError("Please login first.");
        return;
      }

      showLoading();

      try {
        const response = await fetch(`${API}/products/buy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
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

  /* ================= GLOBAL EXPORTS ================= */

  window.closePopup = closePopup;
  window.goToMyProducts = goToMyProducts;
  window.closeErrorPopup = closeErrorPopup;
  window.goToRecharge = goToRecharge;

});