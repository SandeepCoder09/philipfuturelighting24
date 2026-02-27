document.addEventListener("DOMContentLoaded", initTeamPage);

/* =====================================================
   INIT PAGE
===================================================== */
async function initTeamPage() {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    await Promise.all([
      loadTeamData(token),
      loadIncomeData(token)
    ]);
  } catch (error) {
    console.error("Team Page Error:", error);
  }
}


/* =====================================================
   LOAD TEAM DATA
===================================================== */
async function loadTeamData(token) {
  const response = await fetch(`${API}/referral/supervisor-team`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.error("Supervisor API Error:", response.status);
    return;
  }

  const data = await response.json();

  if (!data.success) return;

  /* ===== Summary ===== */
  setText("totalMembers", data.totalMembers);
  setMoney("totalRecharge", data.totalTeamRecharge);
  setMoney("totalCommission", data.totalTeamCommission);

  /* ===== Table ===== */
  renderTable(data.team);
}


/* =====================================================
   LOAD COMMISSION / DASHBOARD DATA
===================================================== */
async function loadIncomeData(token) {
  const response = await fetch(`${API}/referral/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.error("Dashboard API Error:", response.status);
    return;
  }

  const data = await response.json();

  if (!data.success) return;

  /* ===== Commission Overview ===== */
  setMoney("totalIncome", data.totalPromotionIncome);
  setMoney("todayIncome", data.todayIncome);
  setMoney("yesterdayIncome", data.yesterdayIncome);
  setMoney("weekIncome", data.weekIncome);
  setMoney("pendingIncome", data.pendingIncome);
  setMoney("invitationReward", data.invitationReward);

  /* ===== Level Income ===== */
  setMoney("level1Income", data.level1Income);
  setMoney("level2Income", data.level2Income);
  setMoney("level3Income", data.level3Income);

  /* ===== Qualification ===== */
  handleQualification(data.isQualified);
}


/* =====================================================
   RENDER TEAM TABLE
===================================================== */
function renderTable(team) {
  const tableBody = document.getElementById("teamTable");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (!team || team.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="no-data">
          No team members found
        </td>
      </tr>
    `;
    return;
  }

  // Sort by Level → Commission (desc)
  team.sort((a, b) => {
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    return (b.totalCommission || 0) - (a.totalCommission || 0);
  });

  team.forEach(member => {
    const joinDate = member.joinDate
      ? new Date(member.joinDate).toLocaleDateString()
      : "-";

    const row = `
      <tr>
        <td>${member.userId}</td>
        <td>${member.level}</td>
        <td>${member.totalRecharge || 0} INR</td>
        <td>${member.totalCommission || 0} INR</td>
        <td>${joinDate}</td>
      </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", row);
  });
}


/* =====================================================
   QUALIFICATION STATUS
===================================================== */
function handleQualification(isQualified) {
  const box = document.getElementById("qualificationStatus");
  if (!box) return;

  if (isQualified) {
    box.innerHTML = "✅ Qualified for Commission";
    box.style.color = "#00ff9d";
  } else {
    box.innerHTML = "❌ Not Qualified (Purchase ₹399 to unlock)";
    box.style.color = "#ff4d4d";
  }
}


/* =====================================================
   HELPERS
===================================================== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText = value ?? 0;
}

function setMoney(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText = (value ?? 0) + " INR";
}


/* =====================================================
   REDIRECT
===================================================== */
function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "../../auth/index.html";
}