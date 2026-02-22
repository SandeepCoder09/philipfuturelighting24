document.addEventListener("DOMContentLoaded", function () {

  const API = "https://philips-backend.onrender.com/api";

  const loadingScreen = document.getElementById("loadingScreen");
  const successPopup = document.getElementById("successPopup");
  const buyButtons = document.querySelectorAll(".subscribe-btn");

  function showLoading() {
    loadingScreen.classList.add("active");
  }

  function hideLoading() {
    loadingScreen.classList.remove("active");
  }

  function showSuccess() {
    successPopup.classList.add("active");
  }

  function closePopup() {
    successPopup.classList.remove("active");
  }

  function goToMyProducts() {
    window.location.href = "../my-products/index.html";
  }

  buyButtons.forEach(button => {
    button.addEventListener("click", async function () {

      const card = this.closest(".card");

      const name = card.querySelector("h2").innerText;
      const price = parseInt(
        card.querySelector(".price").innerText.replace("₹", "")
      );
      const earning = parseInt(
        card.querySelector(".daily-earning").innerText.replace("Daily Earning: ₹", "")
      );

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
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
          alert("Insufficient Balance. Please Recharge.");
          return;
        }

        showSuccess();

      } catch (error) {
        hideLoading();
        alert("Something went wrong. Try again.");
      }

    });
  });

  window.closePopup = closePopup;
  window.goToMyProducts = goToMyProducts;

});
