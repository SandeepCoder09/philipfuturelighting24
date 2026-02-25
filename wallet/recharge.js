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
// Recharge Button Logic (JWT)
// ===============================

rechargeBtn.addEventListener("click", async () => {

  if (!selectedAmount) {
    alert("Please select amount");
    return;
  }

  // ✅ Get JWT token
  const token = localStorage.getItem("token");

  if (!token) {
    alert("User not logged in");
    window.location.href = "../auth/index.html";
    return;
  }

  try {
    rechargeBtn.innerText = "Processing...";
    rechargeBtn.disabled = true;

    const response = await fetch(
      "https://philips-backend.onrender.com/api/wallet/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          amount: Number(selectedAmount)
        })
      }
    );

    const data = await response.json();

    console.log("Create Order Response:", data);

    if (!response.ok) {
      alert(data.message || "Order creation failed");
      rechargeBtn.innerText = "Recharge Now";
      rechargeBtn.disabled = false;
      return;
    }

    if (!data.payment_session_id) {
      alert("Payment session not received");
      rechargeBtn.innerText = "Recharge Now";
      rechargeBtn.disabled = false;
      return;
    }

    const cashfree = Cashfree({
      mode: "production"
    });

    await cashfree.checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_modal"
    });

    rechargeBtn.innerText = "Recharge Now";
    rechargeBtn.disabled = false;

  } catch (error) {
    console.error("Recharge error:", error);
    alert("Server error");
    rechargeBtn.innerText = "Recharge Now";
    rechargeBtn.disabled = false;
  }
});