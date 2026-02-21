document.addEventListener("DOMContentLoaded", function () {

  const withdrawBtn = document.getElementById("withdrawBtn");
  const modal = document.getElementById("withdrawModal");
  const modalDetails = document.getElementById("modalDetails");
  const cancelBtn = document.getElementById("cancelWithdraw");
  const confirmBtn = document.getElementById("confirmWithdraw");
  const amountInput = document.getElementById("withdrawAmount");

  let pendingAmount = null;

  /* ===========================
     TOAST
  =========================== */
  function showToast(message) {
    const toast = document.getElementById("customToast");
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  /* ===========================
     CLICK WITHDRAW
  =========================== */
  withdrawBtn.addEventListener("click", function () {

    const amount = parseFloat(amountInput.value);

    // 1️⃣ Empty check
    if (!amount) {
      showToast("Please enter amount.");
      return;
    }

    // 2️⃣ Minimum check
    if (amount < 120) {
      showToast("Minimum withdrawal amount is ₹120.");
      return;
    }

    // 3️⃣ Valid amount → Show modal
    const fee = amount * 0.10;
    const finalAmount = amount - fee;

    pendingAmount = amount;

    modalDetails.innerHTML = `
      <strong>Withdrawal Amount:</strong> ₹${amount.toFixed(2)} <br>
      <strong>Processing Fee (10%):</strong> ₹${fee.toFixed(2)} <br>
      <strong>You Will Receive:</strong> ₹${finalAmount.toFixed(2)}
    `;

    modal.classList.add("active");
  });

  /* ===========================
     CANCEL
  =========================== */
  cancelBtn.addEventListener("click", function () {
    modal.classList.remove("active");
  });

  /* ===========================
     CONFIRM
  =========================== */
  confirmBtn.addEventListener("click", async function () {

    const token = localStorage.getItem("token");

    if (!token) {
      modal.classList.remove("active");
      showToast("Login required.");
      return;
    }

    try {

      confirmBtn.disabled = true;
      confirmBtn.innerText = "Processing...";

      const res = await fetch(
        "https://philips-backend.onrender.com/api/wallet/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ amount: pendingAmount })
        }
      );

      const data = await res.json();

      modal.classList.remove("active");

      if (!res.ok) {
        showToast(data.message || "Withdrawal failed.");
      } else {
        showToast(data.message || "Withdrawal request submitted.");
        amountInput.value = "";
      }

    } catch (error) {
      modal.classList.remove("active");
      showToast("Server error.");
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.innerText = "Confirm";
    }

  });

});
