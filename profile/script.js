async function loadProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  try {
    // =========================
    // Load Profile Data
    // =========================
    const profileRes = await fetch(
      "https://philips-backend.onrender.com/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const profileData = await profileRes.json();

    if (!profileData.user) {
      logout();
      return;
    }

    const user = profileData.user;

    document.getElementById("mobile").innerText = user.mobile;
    document.getElementById("uid").innerText = user._id;
    document.getElementById("username").innerText =
      "User" + user._id.slice(-5);

    // =========================
    // Load Wallet Balance
    // =========================
    const balanceRes = await fetch(
      "https://philips-backend.onrender.com/api/wallet/balance",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const balanceData = await balanceRes.json();

    if (balanceData.balance !== undefined) {
      const formatted = Number(balanceData.balance)
        .toLocaleString("en-IN");

      document.getElementById("walletBalance").innerText = formatted;
    }

  } catch (error) {
    alert("Server error. Please try again.");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../auth/index.html";
}

loadProfile();