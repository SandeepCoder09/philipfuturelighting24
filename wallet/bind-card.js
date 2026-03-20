/* =====================================
   PHILIPS BIND BANK SCRIPT (FIXED)
===================================== */


/* =====================================
   DOM ELEMENTS
===================================== */

const accountNumberInput = document.getElementById("accountNumber");
const ifscInput = document.getElementById("ifsc");
const holderNameInput = document.getElementById("holderName");
const bankNameInput = document.getElementById("bankName");

const btnText = document.getElementById("btnText");
const loader = document.querySelector(".loader");
const messageBox = document.getElementById("messageBox");
const bankContainer = document.getElementById("bankContainer");


/* =====================================
   TOKEN CHECK
===================================== */
function ensureLoggedIn() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return false;
  }

  return true;
}


/* =====================================
   BIND BANK FUNCTION (FIXED)
===================================== */
async function bindBank() {

  if (!ensureLoggedIn()) return;

  const data = {
    accountNumber: accountNumberInput.value.trim(),
    ifsc: ifscInput.value.trim().toUpperCase(),
    holderName: holderNameInput.value.trim(),
    bankName: bankNameInput.value.trim()
  };

  messageBox.className = "message hidden";

  if (!data.accountNumber || !data.ifsc || !data.holderName || !data.bankName) {
    showMessage("All fields are required", "error");
    return;
  }

  btnText.classList.add("hidden");
  loader.classList.remove("hidden");

  try {

    // ✅ Using centralized authFetch
    const response = await authFetch("/wallet/bind-bank", {
      method: "POST",
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      showMessage("Bank linked successfully", "success");
      clearInputs();
      loadBanks();
    } else {
      showMessage(result.message || "Failed to bind bank", "error");
    }

  } catch (error) {
    console.error("Bind bank error:", error);
    showMessage("Server error. Please try again.", "error");
  }

  btnText.classList.remove("hidden");
  loader.classList.add("hidden");
}


/* =====================================
   LOAD BANKS (FIXED)
===================================== */
async function loadBanks() {

  if (!ensureLoggedIn()) return;

  const bindForm = document.getElementById("bindForm"); // add id="bindForm" to your form div in HTML

  try {

    const response = await authFetch("/wallet/banks");

    if (!response.ok) {
      console.error("Failed to load banks");
      return;
    }

    const banks = await response.json();

    bankContainer.innerHTML = "";

    if (!banks.length) {
      bankContainer.innerHTML =
        `<div class="bank-empty">No bank linked yet</div>`;
      if (bindForm) bindForm.style.display = "block"; // show form if no bank
      return;
    }

    // ✅ Bank exists — hide the form
    if (bindForm) bindForm.style.display = "none";

    banks.forEach(bank => {
      bankContainer.innerHTML += `
        <div class="bank-item">
          <strong>${bank.bankName}</strong><br>
          A/C: ****${bank.accountNumber.slice(-4)}<br>
          IFSC: ${bank.ifsc}
        </div>
      `;
    });

  } catch (error) {
    console.error("Load banks error:", error);
  }
}


/* =====================================
   HELPERS
===================================== */
function showMessage(text, type) {
  messageBox.innerText = text;
  messageBox.className = `message ${type}`;
}

function clearInputs() {
  accountNumberInput.value = "";
  ifscInput.value = "";
  holderNameInput.value = "";
  bankNameInput.value = "";
}


/* =====================================
   INITIAL LOAD
===================================== */
document.addEventListener("DOMContentLoaded", loadBanks);