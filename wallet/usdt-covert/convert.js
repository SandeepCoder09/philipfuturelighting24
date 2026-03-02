// =====================================================
// USDT → INR CONVERSION MODULE
// =====================================================

const FIXED_RATE = 80;

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("usdtAmount");
  const preview = document.getElementById("inrPreview");
  const convertBtn = document.getElementById("convertBtn");
  const messageBox = document.getElementById("convertMessage");
  const balanceElement = document.getElementById("usdtBalance");

  if (!input || !preview || !convertBtn) return;

  // ==========================================
  // LOAD USER USDT BALANCE
  // ==========================================
  async function loadBalance() {
    try {
  
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await fetch(`${API_BASE}/users/profile`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to load balance");
      }
  
      console.log("Profile API Response:", data);
  
      const usdtBalance =
        data.usdtBalance ??
        data.user?.usdtBalance ??
        0;
  
      if (balanceElement) {
        balanceElement.innerText = Number(usdtBalance).toFixed(2);
      }
  
    } catch (error) {
      console.error("Balance Load Error:", error);
    }
  }

  loadBalance();


  // ==========================================
  // LIVE INR PREVIEW
  // ==========================================
  input.addEventListener("input", () => {
    const value = Number(input.value);

    preview.textContent =
      value > 0
        ? (value * FIXED_RATE).toLocaleString("en-IN")
        : "0";
  });


  // ==========================================
  // CONVERT BUTTON HANDLER
  // ==========================================
  convertBtn.addEventListener("click", async () => {

    const amount = Number(input.value);
    const currentBalance = balanceElement
      ? Number(balanceElement.innerText)
      : 0;

    if (!amount || amount <= 0) {
      showMessage("Enter valid USDT amount", "error");
      return;
    }

    if (amount > currentBalance) {
      showMessage("Insufficient USDT balance", "error");
      return;
    }

    try {

      convertBtn.disabled = true;
      convertBtn.innerText = "Processing...";

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/usdt/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ amount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Conversion failed");
      }

      showMessage("Conversion successful", "success");

      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (error) {
      console.error("Convert Error:", error);
      showMessage(error.message || "Conversion failed", "error");
    } finally {
      convertBtn.disabled = false;
      convertBtn.innerText = "Convert Now";
    }

  });


  // ==========================================
  // MESSAGE DISPLAY
  // ==========================================
  function showMessage(text, type) {

    if (!messageBox) return;

    messageBox.innerText = text;

    messageBox.style.color =
      type === "success" ? "#22c55e" :
      type === "error" ? "#ef4444" :
      "#ffffff";
  }

});