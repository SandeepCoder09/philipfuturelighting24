/* =====================================
PHILIPS PROFILE SCRIPT (TOAST VERSION)
===================================== */

/* ===============================
TOAST NOTIFICATION
=============================== */

function showToast(message, duration = 2500) {

  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

/* ===============================
LOAD PROFILE
=============================== */

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
    const profileRes = await authFetch("/users/profile");

    if (!profileRes.ok) {
      throw new Error("Profile fetch failed");
    }

    const profileData = await profileRes.json();
    const user = profileData.user;

    // ===============================
    // DISPLAY USER INFO
    // ===============================
    const mobileEl = document.getElementById("mobile");
    const uidEl = document.getElementById("uid");
    const usernameEl = document.getElementById("username");

    if (mobileEl) mobileEl.innerText = user.mobile;
    if (uidEl) uidEl.innerText = user.userId;
    if (usernameEl) usernameEl.innerText = "User" + user.userId;

    // ===============================
    // LOAD WALLET BALANCE
    // ===============================
    await refreshWalletBalance();

  } catch (error) {


    console.error("Profile Error:", error);

    showToast("Server Error. Please Login Again.");

    localStorage.removeItem("token");

    setTimeout(() => {
      window.location.href = "../auth/index.html";
    }, 2000);

  }
}

/* ===============================
REFRESH WALLET BALANCE
=============================== */
async function refreshWalletBalance() {

  try {

    const balanceRes = await authFetch("/wallet/balance");

    if (!balanceRes.ok) {
      throw new Error("Failed to fetch balance");
    }

    const balanceData = await balanceRes.json();

    const walletEl = document.getElementById("walletBalance");

    if (walletEl) {
      walletEl.innerText =
        Number(balanceData.balance).toLocaleString("en-IN");
    }

  } catch (error) {
    console.error("Wallet refresh error:", error);
    showToast("Failed to refresh wallet balance");
  }
}

/* ===============================
REFRESH BUTTON HANDLER
=============================== */
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

/* ===============================
LOGOUT
=============================== */
function logout() {

  showToast("Logging out...");

  localStorage.removeItem("token");

  setTimeout(() => {
    window.location.href = "../auth/index.html";
  }, 800);

}

/* ===============================
INIT
=============================== */
loadProfile();