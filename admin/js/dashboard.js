document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});


/* ==============================
   LOAD DASHBOARD
============================== */
async function loadDashboard() {
  try {

    // 🔥 FIXED: removed ${API}
    const response = await authFetch(`/api/admin/dashboard`);

    if (!response.ok) {
      throw new Error("Failed to load dashboard");
    }

    const data = await response.json();

    // ================= OVERALL =================
    setText("totalUsers", data.totalUsers);
    setMoney("totalRecharge", data.totalRecharge);
    setMoney("totalWithdraw", data.totalWithdraw);
    setMoney("totalCommission", data.totalCommission);
    setMoney("totalWithdrawRequested", data.totalWithdrawRequested);

    setText("pendingWithdraw", data.pendingWithdrawCount);
    setText("underReviewWithdraw", data.underReviewWithdrawCount);
    setText("successWithdrawCount", data.successWithdrawCount);

    // ================= TODAY =================
    setText("todayUsers", data.todayUsers);
    setMoney("todayRecharge", data.todayRecharge);
    setMoney("todayWithdraw", data.todayWithdraw);
    setMoney("todayCommission", data.todayCommission);

  } catch (error) {
    console.error("Dashboard Error:", error);
    showToast("Failed to load dashboard data", "error");
  }
}


/* ==============================
   SAFE TEXT SETTER
============================== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value || 0;
}


/* ==============================
   SAFE MONEY SETTER
============================== */
function setMoney(id, amount) {
  const el = document.getElementById(id);
  if (el) el.innerText = "₹" + formatMoney(amount);
}


/* ==============================
   MONEY FORMATTER
============================== */
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}