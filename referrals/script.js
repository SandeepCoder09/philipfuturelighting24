const API = "https://philips-backend.onrender.com/api";

async function loadReferralDashboard() {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  try {

    // ===== GET PROFILE FOR userId =====
    const profileRes = await fetch(`${API}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const profileData = await profileRes.json();
    const user = profileData.user;

    // ===== GENERATE FULL REFERRAL LINK =====
    const domain = window.location.origin;
    const referralLink =
      `${domain}/auth/register.html?invite=${user.userId}`;

    document.getElementById("referralLink").value = referralLink;

    // ===== COPY BUTTON =====
    document.getElementById("copyBtn")
      .addEventListener("click", async () => {

        await navigator.clipboard.writeText(referralLink);
        alert("Referral link copied!");
      });

    // ===== LOAD DASHBOARD DATA =====
    const response = await fetch(`${API}/referral/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();

    document.getElementById("activeUsers").innerText =
      data.activeUsers || 0;

    document.getElementById("teamSize").innerText =
      data.teamSize || 0;

    document.getElementById("totalIncome").innerText =
      (data.totalPromotionIncome || 0) + " INR";

    document.getElementById("yesterdayIncome").innerText =
      (data.yesterdayIncome || 0) + " INR";

    document.getElementById("directReferral").innerText =
      data.directReferralNumber || 0;

    document.getElementById("invitationReward").innerText =
      data.invitationReward || 0;

  } catch (error) {
    console.error("Referral Error:", error);
  }
}

loadReferralDashboard();
