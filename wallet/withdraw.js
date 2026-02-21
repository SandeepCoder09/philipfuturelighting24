const withdrawBtn = document.getElementById("withdrawBtn");
const modal = document.getElementById("withdrawModal");
const modalDetails = document.getElementById("modalDetails");
const cancelBtn = document.getElementById("cancelWithdraw");
const confirmBtn = document.getElementById("confirmWithdraw");

let pendingAmount = null;

/* ===========================
   TOAST FUNCTION (UNCHANGED)
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
   OPEN CONFIRM MODAL
=========================== */
withdrawBtn.addEventListener("click", () => {

  const amount = parseFloat(document.getElementById("withdrawAmount").value);

  if (!amount) {
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
    Processing Fee: ₹${fee.toFixed(2)}<br>
    You will receive: ₹${finalAmount.toFixed(2)}
  `;

  modal.classList.add("active");
});

/* ===========================
   CANCEL MODAL
=========================== */
cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

/* ===========================
   CONFIRM WITHDRAW
=========================== */
confirmBtn.addEventListener("click", async () => {

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

    // Close modal BEFORE toast
    modal.classList.remove("active");

    if (!res.ok) {
      showToast(data.message || "Withdrawal failed.");
    } else {
      showToast(data.message || "Withdrawal request submitted.");
      document.getElementById("withdrawAmount").value = "";
    }

  } catch (error) {

    modal.classList.remove("active");
    showToast("Server error.");

  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerText = "Confirm";
  }

});
