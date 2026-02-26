const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.startsWith("10.");

const API = isLocal
  ? "http://localhost:5001/api"
  : "https://philips-backend.onrender.com/api";

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
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../auth/index.html";
  }
  return token;
}


/* =====================================
   BIND BANK FUNCTION
===================================== */
async function bindBank() {

  const token = getToken();

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
    const response = await fetch(`${API}/wallet/bind-bank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
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
   LOAD BANKS
===================================== */
async function loadBanks() {

  const token = getToken();

  try {
    const response = await fetch(`${API}/wallet/banks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error("Failed to load banks");
      return;
    }

    const banks = await response.json();

    bankContainer.innerHTML = "";

    if (!banks.length) {
      bankContainer.innerHTML =
        `<div class="bank-empty">No bank linked yet</div>`;
      return;
    }

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