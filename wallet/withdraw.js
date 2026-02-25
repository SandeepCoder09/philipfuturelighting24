// 🌍 Auto API Switch
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5001"
    : "https://philips-backend.onrender.com";

document.addEventListener("DOMContentLoaded", function () {

  const withdrawBtn = document.getElementById("withdrawBtn");
  const modal = document.getElementById("withdrawModal");
  const modalDetails = document.getElementById("modalDetails");
  const cancelBtn = document.getElementById("cancelWithdraw");
  const confirmBtn = document.getElementById("confirmWithdraw");
  const amountInput = document.getElementById("withdrawAmount");
  const pinInput = document.getElementById("withdrawPin");

  let pendingAmount = 0;

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
  withdrawBtn.addEventListener("click", async function () {

    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Login required.");
      return;
    }

    try {
      const checkRes = await fetch(
        `${API_BASE}/api/users/check-withdraw-pin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const checkData = await checkRes.json();

      if (!checkData.hasPin) {
        window.location.href = "withdraws-pin/set-withdraw-pin.html";
        return;
      }

    } catch (error) {
      showToast("Error checking PIN.");
      return;
    }

    const amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {
      showToast("Please enter amount.");
      return;
    }

    if (amount < 120) {
      showToast("Minimum withdrawal amount is ₹120.");
      return;
    }

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

    if (!pinInput || !pinInput.value || pinInput.value.length !== 4) {
      showToast("Enter valid 4-digit PIN.");
      return;
    }

    try {

      confirmBtn.disabled = true;
      confirmBtn.innerText = "Processing...";

      const res = await fetch(
        `${API_BASE}/api/wallet/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: pendingAmount,
            pin: pinInput.value
          })
        }
      );

      const data = await res.json();

      modal.classList.remove("active");

      if (!res.ok) {
        showToast(data.message || "Withdrawal failed.");
      } else {
        showToast(data.message || "Withdrawal request submitted.");
        amountInput.value = "";
        pinInput.value = "";
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