/* =====================================
   PHILIPS RECHARGE SCRIPT (FIXED)
===================================== */

// ===============================
// Amount Selection Logic
// ===============================

const amountButtons = document.querySelectorAll(".amount-btn");
const selectedAmountInput = document.getElementById("selectedAmount");
const rechargeBtn = document.getElementById("rechargeBtn");

let selectedAmount = null;

rechargeBtn.disabled = true;

amountButtons.forEach(button => {
  button.addEventListener("click", () => {
    amountButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    selectedAmount = button.dataset.amount;
    selectedAmountInput.value = "₹" + selectedAmount;

    rechargeBtn.disabled = false;
  });
});


// ===============================
// Recharge Button Logic (JWT + API_BASE)
// ===============================

rechargeBtn.addEventListener("click", async () => {

  if (!selectedAmount) {
    showPhilipsPopup("Error", "Please select amount", "error");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    showPhilipsPopup("Session Expired", "Please login again", "error");
    window.location.href = "../auth/index.html";
    return;
  }

  try {
    rechargeBtn.innerText = "Processing...";
    rechargeBtn.disabled = true;

    // ✅ Using centralized API_BASE
    const response = await authFetch("/wallet/create-order", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(selectedAmount)
      })
    });

    const data = await response.json();

    console.log("Create Order Response:", data);

    if (!response.ok) {
      showPhilipsPopup("Recharge Failed", data.message || "Order creation failed", "error");
      rechargeBtn.innerText = "Recharge Now";
      rechargeBtn.disabled = false;
      return;
    }

    if (!data.payment_session_id) {
      showPhilipsPopup("Error", "Payment session not received", "error");
      rechargeBtn.innerText = "Recharge Now";
      rechargeBtn.disabled = false;
      return;
    }

    // ===============================
    // CASHFREE CHECKOUT
    // ===============================
    const cashfree = Cashfree({
      mode: "production" // change to "sandbox" if testing
    });

    await cashfree.checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_modal"
    });

    rechargeBtn.innerText = "Recharge Now";
    rechargeBtn.disabled = false;

  } catch (error) {
    console.error("Recharge error:", error);

    showPhilipsPopup("Server Error", "Unable to connect to server", "error");

    rechargeBtn.innerText = "Recharge Now";
    rechargeBtn.disabled = false;
  }
});