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
    const profileRes = await fetch(
      "https://philips-backend.onrender.com/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!profileRes.ok) {
      throw new Error("Profile fetch failed");
    }

    const profileData = await profileRes.json();
    const user = profileData.user;

    // ===============================
    // DISPLAY USER INFO (NEW SYSTEM)
    // ===============================
    document.getElementById("mobile").innerText = user.mobile;

    // Show numeric userId instead of Mongo _id
    document.getElementById("uid").innerText = user.userId;

    // Clean username format
    document.getElementById("username").innerText =
      "User" + user.userId;

    // ===============================
    // LOAD WALLET BALANCE
    // ===============================
    const balanceRes = await fetch(
      "https://philips-backend.onrender.com/api/wallet/balance",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!balanceRes.ok) {
      throw new Error("Balance fetch failed");
    }

    const balanceData = await balanceRes.json();

    document.getElementById("walletBalance").innerText =
      Number(balanceData.balance).toLocaleString("en-IN");

  } catch (error) {
    console.error("Error:", error);
    alert("Session expired or backend not responding. Please login again.");
    localStorage.removeItem("token");
    window.location.href = "../auth/index.html";
  }
}

// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "../auth/index.html";
}

loadProfile();
