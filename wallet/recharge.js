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
// Recharge Button Logic
// ===============================

rechargeBtn.addEventListener("click", async () => {

  if (!selectedAmount) {
    alert("Please select amount");
    return;
  }

  // 🔥 Get user from localStorage safely
  let storedUser = localStorage.getItem("user");

  if (!storedUser) {
    alert("User not logged in");
    return;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (err) {
    console.error("Invalid user in localStorage");
    alert("Session error. Please login again.");
    return;
  }

  // Support both _id and id
  const userId = user._id || user.id;

  if (!userId) {
    console.error("User ID missing:", user);
    alert("User ID not found. Please login again.");
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(selectedAmount),
          userId: userId
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

    // Initialize Cashfree (Production)
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