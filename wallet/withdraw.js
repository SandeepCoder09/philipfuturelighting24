document.addEventListener("DOMContentLoaded", function () {

  const withdrawBtn = document.getElementById("withdrawBtn");
  const modal = document.getElementById("withdrawModal");
  const modalDetails = document.getElementById("modalDetails");
  const cancelBtn = document.getElementById("cancelWithdraw");
  const confirmBtn = document.getElementById("confirmWithdraw");
  const amountInput = document.getElementById("withdrawAmount");
  const modalPinBoxes = document.querySelectorAll(".modal-pin-box");
  const bankSection = document.getElementById("bankSection");

  let pendingAmount = 0;
  let selectedBankId = null;

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
     LOAD BANKS
  =========================== */
  async function loadBanks() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API}/wallet/banks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        renderNoBank();
        return;
      }

      const banks = await res.json();

      if (!banks.length) {
        renderNoBank();
      } else {
        renderBankList(banks);
      }

    } catch (error) {
      renderNoBank();
    }
  }

  function renderNoBank() {
    bankSection.innerHTML = `
      <div class="bank-empty">
        ⚠ No bank account linked <br>
        <button class="bind-btn" onclick="window.location.href='bind-card.html'">
          Bind Bank Card
        </button>
      </div>
    `;

    withdrawBtn.disabled = true;
  }

  function renderBankList(banks) {
    withdrawBtn.disabled = false;

    bankSection.innerHTML = banks.map(bank => `
      <div class="bank-card" data-id="${bank._id}">
        <strong>${bank.bankName}</strong><br>
        ****${bank.accountNumber.slice(-4)} • ${bank.holderName}
      </div>
    `).join("");

    document.querySelectorAll(".bank-card").forEach(card => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".bank-card")
          .forEach(c => c.classList.remove("active"));

        card.classList.add("active");
        selectedBankId = card.dataset.id;
      });
    });
  }

  loadBanks();

  /* ===========================
     PIN SYSTEM
  =========================== */
  modalPinBoxes.forEach((box, index) => {

    box.addEventListener("input", () => {
      box.value = box.value.replace(/\D/g, "");

      if (box.value !== "") {
        box.classList.add("filled");
        if (index < modalPinBoxes.length - 1) {
          modalPinBoxes[index + 1].focus();
        }
      } else {
        box.classList.remove("filled");
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && box.value === "" && index > 0) {
        modalPinBoxes[index - 1].focus();
      }
    });

  });

  function getPinValue() {
    return Array.from(modalPinBoxes)
      .map(box => box.value)
      .join("");
  }

  function clearPinBoxes() {
    modalPinBoxes.forEach(box => {
      box.value = "";
      box.classList.remove("filled");
    });
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

    if (!selectedBankId) {
      showToast("Please select a bank account.");
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

    setTimeout(() => {
      modalPinBoxes[0].focus();
    }, 200);
  });

  /* ===========================
     CANCEL
  =========================== */
  cancelBtn.addEventListener("click", function () {
    modal.classList.remove("active");
    clearPinBoxes();
  });

  /* ===========================
     CONFIRM WITHDRAW
  =========================== */
  confirmBtn.addEventListener("click", async function () {

    const token = localStorage.getItem("token");

    if (!token) {
      modal.classList.remove("active");
      showToast("Login required.");
      return;
    }

    const pin = getPinValue();

    if (pin.length !== 4) {
      showToast("Enter valid 4-digit PIN.");
      return;
    }

    try {

      confirmBtn.disabled = true;
      confirmBtn.innerText = "Processing...";

      const res = await fetch(`${API}/wallet/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: pendingAmount,
          pin: pin,
          bankId: selectedBankId
        })
      });

      const data = await res.json();

      modal.classList.remove("active");

      if (!res.ok) {
        showToast(data.message || "Withdrawal failed.");
      } else {
        showToast(data.message || "Withdrawal request submitted.");
        amountInput.value = "";
        clearPinBoxes();
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