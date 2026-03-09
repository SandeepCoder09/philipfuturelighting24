document.addEventListener("DOMContentLoaded", function () {

  checkWithdrawPin();

  const withdrawBtn = document.getElementById("withdrawBtn");
  const modal = document.getElementById("withdrawModal");
  const modalDetails = document.getElementById("modalDetails");
  const cancelBtn = document.getElementById("cancelWithdraw");
  const confirmBtn = document.getElementById("confirmWithdraw");
  const modalPinBoxes = document.querySelectorAll(".modal-pin-box");
  const bankSection = document.getElementById("bankSection");
  const amountInput = document.getElementById("withdrawAmount");
  const feePreview = document.getElementById("feePreview");
  const finalPreview = document.getElementById("finalAmountPreview");
  const balanceElement = document.getElementById("availableBalance");

  let pendingAmount = 0;
  let selectedBankId = null;

  /* ===========================
     CHECK WITHDRAW PIN STATUS
  =========================== */
  async function checkWithdrawPin() {
    try {

      const res = await authFetch("/users/has-withdraw-pin");

      if (!res.ok) return;

      const data = await res.json();

      // 🚨 If PIN not set → redirect to set PIN page
      if (!data.hasPin) {

        window.location.href = "withdraws-pin/set-withdraw-pin.html";

      }

    } catch (error) {

      console.error("Withdraw PIN Check Error:", error);

    }
  }

  /* ===========================
     TOAST
  =========================== */
  function showToast(message, type = "success") {
    const toast = document.getElementById("customToast");
    if (!toast) return;

    toast.className = `custom-toast ${type}`;

    let icon = "fa-circle-check";
    if (type === "error") icon = "fa-circle-xmark";
    if (type === "warning") icon = "fa-triangle-exclamation";

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /* ===========================
     LOAD WALLET BALANCE
  =========================== */
  async function loadBalance() {
    try {

      const res = await authFetch("/users/profile");
      if (!res.ok) return;

      const data = await res.json();

      const walletBalance =
        data.walletBalance ??
        data.user?.walletBalance ??
        0;

      if (balanceElement) {
        balanceElement.innerText = Number(walletBalance).toFixed(2);
      }

    } catch (error) {
      console.error("Balance Load Error:", error);
    }
  }

  loadBalance();

  /* ===========================
     LIVE FEE PREVIEW
  =========================== */
  if (amountInput) {
    amountInput.addEventListener("input", () => {

      const amount = Number(amountInput.value) || 0;
      const fee = amount * 0.10;
      const finalAmount = amount - fee;

      if (feePreview) feePreview.innerText = fee.toFixed(2);
      if (finalPreview) finalPreview.innerText = finalAmount.toFixed(2);

    });
  }

  /* ===========================
   LOAD BANKS
=========================== */
  async function loadBanks() {
    try {
      const res = await authFetch("/wallet/banks");

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
      console.error("Bank Load Error:", error);
      renderNoBank();
    }
  }

  /* ===========================
     NO BANK UI
  =========================== */
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
    selectedBankId = null;
  }

  /* ===========================
     RENDER BANK LIST
  =========================== */
  function renderBankList(banks) {

    selectedBankId = null;
    withdrawBtn.disabled = true;

    bankSection.innerHTML = banks.map((bank, index) => `
    <div class="bank-card" data-id="${bank._id}">
      <div class="bank-info">
        <strong>${bank.bankName}</strong><br>
        ****${bank.accountNumber.slice(-4)} • ${bank.holderName}
      </div>
      <button class="select-bank-btn">
        Select
      </button>
    </div>
  `).join("");

    const cards = document.querySelectorAll(".bank-card");

    cards.forEach(card => {
      const button = card.querySelector(".select-bank-btn");

      button.addEventListener("click", (e) => {
        e.stopPropagation();

        // Remove active from all
        cards.forEach(c => {
          c.classList.remove("active");
          c.querySelector(".select-bank-btn").innerText = "Select";
        });

        // Activate selected
        card.classList.add("active");
        button.innerText = "Selected";

        selectedBankId = card.dataset.id;
        withdrawBtn.disabled = false;
      });
    });

    // 🔥 OPTIONAL: Auto-select first bank (recommended UX)
    if (banks.length > 0) {
      const firstCard = cards[0];
      firstCard.classList.add("active");
      firstCard.querySelector(".select-bank-btn").innerText = "Selected";
      selectedBankId = firstCard.dataset.id;
      withdrawBtn.disabled = false;
    }
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
  withdrawBtn.addEventListener("click", function () {

    if (!selectedBankId) {
      showToast("Please select a bank account.", "warning");
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

    const pin = getPinValue();

    if (pin.length !== 4) {
      showToast("Enter valid 4-digit PIN.");
      return;
    }

    try {

      confirmBtn.disabled = true;
      confirmBtn.innerText = "Processing...";

      const res = await authFetch("/wallet/withdraw", {
        method: "POST",
        body: JSON.stringify({
          amount: pendingAmount,
          pin: pin,
          bankId: selectedBankId
        })
      });

      const data = await res.json();

      modal.classList.remove("active");

      if (!res.ok) {
        showToast(data.message || "Withdrawal failed.", "error");
      } else {
        showToast("Withdrawal request submitted.", "success");
        amountInput.value = "";
        clearPinBoxes();
        loadBalance(); // 🔥 Refresh balance after withdrawal
      }

    } catch (error) {
      console.error("Withdraw Error:", error);
      modal.classList.remove("active");
      showToast("Server error.");
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.innerText = "Submit";
    }

  });

});