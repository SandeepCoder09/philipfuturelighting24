// ===============================
// Amount Selection Logic
// ===============================

const amountButtons = document.querySelectorAll(".amount-btn");
const selectedAmountInput = document.getElementById("selectedAmount");
const rechargeBtn = document.getElementById("rechargeBtn");

let selectedAmount = null;

// Disable recharge button initially
rechargeBtn.disabled = true;

// Handle amount button click
amountButtons.forEach(button => {
  button.addEventListener("click", () => {

    // Remove active class from all buttons
    amountButtons.forEach(btn => btn.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    // Get amount from data attribute
    selectedAmount = button.dataset.amount;

    // Fill readonly input field
    selectedAmountInput.value = "₹" + selectedAmount;

    // Enable recharge button
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

    // Call backend to create order
    const response = await fetch(
      "https://philips-backend.onrender.com/api/wallet/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: Number(selectedAmount) })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      console.error("Order creation failed:", data);
      alert("Order creation failed");
      rechargeBtn.innerText = "Recharge Now";
      rechargeBtn.disabled = false;
      return;
    }

    // Initialize Cashfree (Production Mode)
    const cashfree = Cashfree({
      mode: "production"
    });

    // Open Checkout Popup
    await cashfree.checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_modal"
    });

    // Reset button after popup
    rechargeBtn.innerText = "Recharge Now";
    rechargeBtn.disabled = false;

  } catch (error) {
    console.error("Recharge error:", error);
    alert("Something went wrong");

    rechargeBtn.innerText = "Recharge Now";
    rechargeBtn.disabled = false;
  }
});