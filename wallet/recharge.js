// ===============================
// Amount Selection Logic
// ===============================

const amountButtons = document.querySelectorAll(".amount-btn");
const selectedAmountInput = document.getElementById("selectedAmount");
const rechargeBtn = document.getElementById("rechargeBtn");

let selectedAmount = null;

// Disable recharge button initially
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
// Recharge Button Logic
// ===============================

rechargeBtn.addEventListener("click", async () => {

  if (!selectedAmount) {
    alert("Please select amount");
    return;
  }

  try {
    rechargeBtn.innerText = "Processing...";
    rechargeBtn.disabled = true;

    // 🔥 Call backend
    const response = await fetch(
      "https://philips-backend.onrender.com/api/wallet/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(selectedAmount)
        })
      }
    );

    // Check if server responded properly
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      alert("Order creation failed (server error)");
      resetButton();
      return;
    }

    const data = await response.json();

    if (!data.payment_session_id) {
      console.error("Invalid response:", data);
      alert("Order creation failed");
      resetButton();
      return;
    }

    // ===============================
    // Cashfree Checkout
    // ===============================

    if (typeof Cashfree === "undefined") {
      alert("Cashfree SDK not loaded");
      resetButton();
      return;
    }

    const cashfree = Cashfree({
      mode: "production"
    });

    await cashfree.checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_modal"
    });

    resetButton();

  } catch (error) {
    console.error("Recharge error:", error);
    alert("Something went wrong");
    resetButton();
  }
});


// ===============================
// Helper Function
// ===============================

function resetButton() {
  rechargeBtn.innerText = "Recharge Now";
  rechargeBtn.disabled = false;
}