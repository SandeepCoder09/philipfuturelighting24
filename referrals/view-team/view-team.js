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
      loadTeamData(),
      loadIncomeData()
    ]);
  } catch (error) {
    console.error("Team Page Error:", error);
    redirectToLogin();
  }
}


/* =====================================================
   LOAD TEAM DATA
===================================================== */
async function loadTeamData() {

  const response = await authFetch("/referral/supervisor-team");

  if (!response.ok) {
    console.error("Supervisor API Error:", response.status);
    return;
  }

  const data = await response.json();
  if (!data.success) return;

  setText("totalMembers", data.totalMembers);
  setMoney("totalRecharge", data.totalTeamRecharge);
  setMoney("totalCommission", data.totalTeamCommission);

  renderTable(data.team);
}


/* =====================================================
   LOAD COMMISSION DATA
===================================================== */
async function loadIncomeData() {

  const response = await authFetch("/referral/dashboard");

  if (!response.ok) {
    console.error("Dashboard API Error:", response.status);
    return;
  }

  const data = await response.json();
  if (!data.success) return;

  setMoney("totalIncome", data.totalPromotionIncome);
  setMoney("todayIncome", data.todayIncome);
  setMoney("yesterdayIncome", data.yesterdayIncome);
  setMoney("weekIncome", data.weekIncome);
  setMoney("invitationReward", data.invitationReward);

  setMoney("level1Income", data.level1Income);
  setMoney("level2Income", data.level2Income);
  setMoney("level3Income", data.level3Income);

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

  team.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
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
    box.innerHTML = `
      <span style="display:flex;align-items:center;gap:8px;">
      
        <svg width="24" height="24" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00ffa6"/>
              <stop offset="100%" stop-color="#00c47a"/>
            </linearGradient>
          </defs>
          
          <circle cx="12" cy="12" r="10" fill="url(#grad1)" />
          
          <path d="M7 12l3 3 6-6" 
                stroke="white" 
                stroke-width="2.5" 
                fill="none" 
                stroke-linecap="round" 
                stroke-linejoin="round"/>
        </svg>

        Qualified for Commission
      </span>
    `;

    box.style.color = "#00ff9d";

  } else {

    box.innerHTML = `
      <span style="display:flex;align-items:center;gap:8px;">

        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#ff4d4d"/>
          <line x1="8" y1="8" x2="16" y2="16" stroke="white" stroke-width="2"/>
          <line x1="16" y1="8" x2="8" y2="16" stroke="white" stroke-width="2"/>
        </svg>

        Not Qualified (Purchase ₹399 to unlock)

      </span>
    `;

    box.style.color = "#ff4d4d";
  }
}


/* =====================================================
   HELPERS
===================================================== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? 0;
}

function setMoney(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = (value ?? 0) + " INR";
}


/* =====================================================
   REDIRECT
===================================================== */
function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "../../auth/index.html";
}