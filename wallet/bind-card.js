const API = "https://philips-backend.onrender.com/api/wallet";

async function bindBank() {

  const token = localStorage.getItem("token");
  const btnText = document.getElementById("btnText");
  const loader = document.querySelector(".loader");
  const messageBox = document.getElementById("messageBox");

  const data = {
    accountNumber: accountNumber.value.trim(),
    ifsc: ifsc.value.trim().toUpperCase(),
    holderName: holderName.value.trim(),
    bankName: bankName.value.trim()
  };

  messageBox.className = "message hidden";

  if (!data.accountNumber || !data.ifsc || !data.holderName || !data.bankName) {
    showMessage("All fields are required", "error");
    return;
  }

  btnText.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const response = await fetch(`${API}/bind-bank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage("Bank linked successfully", "success");
      clearInputs();
      loadBanks();
    } else {
      showMessage(result.message || "Failed to bind bank", "error");
    }

  } catch (error) {
    showMessage("Server error. Please try again.", "error");
  }

  btnText.classList.remove("hidden");
  loader.classList.add("hidden");
}

function showMessage(text, type) {
  const messageBox = document.getElementById("messageBox");
  messageBox.innerText = text;
  messageBox.className = "message " + type;
}

function clearInputs() {
  accountNumber.value = "";
  ifsc.value = "";
  holderName.value = "";
  bankName.value = "";
}

async function loadBanks() {

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API}/banks`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const banks = await response.json();

    const container = document.getElementById("bankContainer");
    container.innerHTML = "";

    banks.forEach(bank => {
      container.innerHTML += `
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

loadBanks();