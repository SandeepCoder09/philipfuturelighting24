async function loadProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  try {
    // Load profile
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

    document.getElementById("mobile").innerText = user.mobile;
    document.getElementById("uid").innerText = user._id;
    document.getElementById("username").innerText =
      "User" + user._id.slice(-5);

    // Load balance
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
    alert("Backend not responding. Please wait 30 seconds and refresh.");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "../auth/index.html";
}

loadProfile();