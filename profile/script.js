const API = "https://philips-backend.onrender.com/api";


// ===============================
// LOAD PROFILE
// ===============================
async function loadProfile() {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  try {

    // ===============================
    // LOAD USER PROFILE
    // ===============================
    const profileRes = await fetch(`${API}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!profileRes.ok) {
      throw new Error("Profile fetch failed");
    }

    const profileData = await profileRes.json();
    const user = profileData.user;

    // ===============================
    // DISPLAY USER INFO
    // ===============================
    document.getElementById("mobile").innerText = user.mobile;
    document.getElementById("uid").innerText = user.userId;
    document.getElementById("username").innerText =
      "User" + user.userId;

    // ===============================
    // LOAD WALLET BALANCE
    // ===============================
    await refreshWalletBalance();

  } catch (error) {
    console.error("Profile Error:", error);
    alert("Session expired or backend not responding. Please login again.");
    localStorage.removeItem("token");
    window.location.href = "../auth/index.html";
  }
}


// ===============================
// REFRESH WALLET BALANCE
// ===============================
async function refreshWalletBalance() {

  const token = localStorage.getItem("token");

  try {

    const balanceRes = await fetch(`${API}/wallet/balance`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!balanceRes.ok) {
      throw new Error("Failed to fetch balance");
    }

    const balanceData = await balanceRes.json();

    document.getElementById("walletBalance").innerText =
      Number(balanceData.balance).toLocaleString("en-IN");

  } catch (error) {
    console.error("Wallet refresh error:", error);
  }
}


// ===============================
// REFRESH BUTTON HANDLER
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const refreshBtn = document.getElementById("refreshWalletBtn");

  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {

      refreshBtn.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin"></i>`;

      await refreshWalletBalance();

      setTimeout(() => {
        refreshBtn.innerHTML =
          `<i class="fa-solid fa-rotate-right"></i>`;
      }, 600);

    });
  }

});


// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "../auth/index.html";
}


// ===============================
loadProfile();