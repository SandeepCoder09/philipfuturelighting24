const withdrawBtn = document.getElementById("withdrawBtn");
const modal = document.getElementById("withdrawModal");
const modalDetails = document.getElementById("modalDetails");
const cancelBtn = document.getElementById("cancelWithdraw");
const confirmBtn = document.getElementById("confirmWithdraw");

let pendingAmount = null;

function showToast(message) {
  const toast = document.getElementById("customToast");
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

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
    Processing Fee: ₹${fee}<br>
    You will receive: ₹${finalAmount}
  `;

  modal.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

confirmBtn.addEventListener("click", async () => {

  const token = localStorage.getItem("token");

  try {
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
    showToast(data.message || "Withdrawal request submitted.");

  } catch (error) {
    showToast("Server error.");
  }

  modal.classList.remove("active");
});