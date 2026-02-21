const API = "https://https://philips-backend.onrender.com/api";

async function loadReferralDashboard() {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../login/index.html";
    return;
  }

  try {

    const response = await fetch(`${API}/referral/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    document.getElementById("activeUsers").innerText = data.activeUsers || 0;
    document.getElementById("teamSize").innerText = data.teamSize || 0;
    document.getElementById("totalIncome").innerText =
      (data.totalPromotionIncome || 0) + " INR";
    document.getElementById("yesterdayIncome").innerText =
      (data.yesterdayIncome || 0) + " INR";
    document.getElementById("directReferral").innerText =
      data.directReferralNumber || 0;
    document.getElementById("invitationReward").innerText =
      data.invitationReward || 0;

  } catch (error) {
    console.error("Referral Dashboard Error:", error);
  }
}

loadReferralDashboard();