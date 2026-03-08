/* =====================================
   PHILIPS RECHARGE SCRIPT
   (INR + USDT TRC20 Manual Deposit)
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ==================================================
     TAB SWITCHING (INR / USDT)
  ================================================== */

  const tabBtns = document.querySelectorAll(".tab-btn");
  const inrSection = document.querySelector(".inr-section");
  const usdtSection = document.querySelector(".usdt-section");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {

      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.dataset.method === "usdt") {
        inrSection.style.display = "none";
        usdtSection.style.display = "block";
      } else {
        inrSection.style.display = "block";
        usdtSection.style.display = "none";
      }

    });
  });

  /* ==================================================
     INR AMOUNT SELECTION
  ================================================== */

  const amountButtons = document.querySelectorAll(".amount-btn");
  const selectedAmountInput = document.getElementById("selectedAmount");
  const rechargeBtn = document.getElementById("rechargeBtn");

  let selectedAmount = null;

  if (rechargeBtn) rechargeBtn.disabled = true;

  amountButtons.forEach(button => {
    button.addEventListener("click", () => {

      amountButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      selectedAmount = button.dataset.amount;
      selectedAmountInput.value = "₹" + selectedAmount;

      rechargeBtn.disabled = false;
    });
  });

  /* ==================================================
     INR RECHARGE (CASHFREE)
  ================================================== */

  if (rechargeBtn) {
    rechargeBtn.addEventListener("click", async () => {

      if (!selectedAmount) {
        showPhilipsPopup("Error", "Please select amount", "error");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        showPhilipsPopup("Session Expired", "Please login again", "error");
        window.location.href = "../auth/index.html";
        return;
      }

      try {

        rechargeBtn.innerHTML =
          '<i class="fa fa-spinner fa-spin"></i> Processing...';
        rechargeBtn.disabled = true;

        const response = await authFetch("/wallet/create-order", {
          method: "POST",
          body: JSON.stringify({
            amount: Number(selectedAmount)
          })
        });

        const data = await response.json();

        if (!response.ok) {
          showPhilipsPopup("Recharge Failed", data.message || "Order creation failed", "error");
          rechargeBtn.innerText = "Recharge Now";
          rechargeBtn.disabled = false;
          return;
        }

        if (!data.payment_session_id) {
          showPhilipsPopup("Error", "Payment session not received", "error");
          rechargeBtn.innerText = "Recharge Now";
          rechargeBtn.disabled = false;
          return;
        }

        const cashfree = Cashfree({
          mode: "production" // change to "sandbox" if testing
        });

        await cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal"
        });

        rechargeBtn.innerText = "Recharge Now";
        rechargeBtn.disabled = false;

      } catch (error) {

        console.error("Recharge error:", error);

        showPhilipsPopup("Server Error", "Unable to connect to server", "error");

        rechargeBtn.innerText = "Recharge Now";
        rechargeBtn.disabled = false;
      }

    });
  }

  /* ==================================================
     USDT MANUAL DEPOSIT (TRC20 ONLY)
  ================================================== */

  const usdtSubmitBtn = document.getElementById("usdtSubmit");

  if (usdtSubmitBtn) {

    usdtSubmitBtn.addEventListener("click", async () => {

      const amountInput = document.getElementById("usdtAmount");
      const txnHashInput = document.getElementById("txnHash");

      const amount = amountInput.value.trim();
      const txnHash = txnHashInput.value.trim();

      // ===== Validation =====

      if (!amount || Number(amount) <= 0) {
        showPhilipsPopup("Error", "Please enter valid USDT amount", "error");
        return;
      }

      if (!txnHash) {
        showPhilipsPopup("Error", "Please enter transaction hash", "error");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        showPhilipsPopup("Session Expired", "Please login again", "error");
        window.location.href = "../auth/index.html";
        return;
      }

      try {

        usdtSubmitBtn.innerText = "Submitting...";
        usdtSubmitBtn.disabled = true;

        const response = await authFetch("/wallet/usdt-deposit", {
          method: "POST",
          body: JSON.stringify({
            amount: Number(amount),
            txnHash
            // network removed (TRC20 fixed in backend)
          })
        });

        const data = await response.json();

        if (!response.ok) {
          showPhilipsPopup("Error", data.message || "Submission failed", "error");
          usdtSubmitBtn.innerText = "Submit Deposit";
          usdtSubmitBtn.disabled = false;
          return;
        }

        showPhilipsPopup(
          "Submitted",
          "Deposit submitted successfully. Waiting for  Approval.",
          "success"
        );

        amountInput.value = "";
        txnHashInput.value = "";

        usdtSubmitBtn.innerText = "Submit Deposit";
        usdtSubmitBtn.disabled = false;

      } catch (error) {

        console.error("USDT submission error:", error);

        showPhilipsPopup("Server Error", "Unable to connect to server", "error");

        usdtSubmitBtn.innerText = "Submit Deposit";
        usdtSubmitBtn.disabled = false;
      }

    });

  }

  /* ==================================================
     COPY TRC20 ADDRESS BUTTON
  ================================================== */

  const copyBtn = document.getElementById("copyAddressBtn");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {

      const address = document.getElementById("usdtAddress").innerText;

      // Modern clipboard (HTTPS only)
      if (navigator.clipboard && window.isSecureContext) {

        navigator.clipboard.writeText(address)
          .then(() => {
            showPhilipsPopup("Copied", "Address copied successfully", "success");
          })
          .catch(() => {
            fallbackCopy(address);
          });

      } else {
        fallbackCopy(address);
      }

    });
  }

  function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    showPhilipsPopup("Copied", "Address copied successfully", "success");
  }

});

const FIXED_RATE = 80;

async function loadUsdtBalance() {
  try {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();

    if (data.success) {
      const balance = data.user.usdtBalance || 0;

      document.getElementById("usdtBalance").innerText = balance.toFixed(2);
      document.getElementById("usdtInrValue").innerText =
        (balance * FIXED_RATE).toFixed(2);
    }

  } catch (err) {
    console.error("USDT Balance Error:", err);
  }
}

loadUsdtBalance();

document.getElementById("convertToInrBtn")
  .addEventListener("click", () => {

    const balance = parseFloat(
      document.getElementById("usdtBalance").innerText
    );

    if (balance <= 0) {
      alert("No USDT balance available");
      return;
    }

    // Redirect to convert page
    window.location.href = "../wallet/usdt-covert/usdt-convert.html";
  });