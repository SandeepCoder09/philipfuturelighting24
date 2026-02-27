document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

async function loadDashboard() {

  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "pages/login.html";
    return;
  }

  try {

    const response = await fetch(`${API}/admin/dashboard`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "pages/login.html";
      return;
    }

    const data = await response.json();

    // ================= OVERALL =================
    document.getElementById("totalUsers").innerText =
      data.totalUsers || 0;

    document.getElementById("totalRecharge").innerText =
      "₹" + formatMoney(data.totalRecharge);

    document.getElementById("totalWithdraw").innerText =
      "₹" + formatMoney(data.totalWithdraw);

    document.getElementById("totalCommission").innerText =
      "₹" + formatMoney(data.totalCommission);

    document.getElementById("totalWithdrawRequested").innerText =
      "₹" + formatMoney(data.totalWithdrawRequested);

    document.getElementById("pendingWithdraw").innerText =
      data.pendingWithdrawCount || 0;

    document.getElementById("underReviewWithdraw").innerText =
      data.underReviewWithdrawCount || 0;

    document.getElementById("successWithdrawCount").innerText =
      data.successWithdrawCount || 0;

    // ================= TODAY =================
    document.getElementById("todayUsers").innerText =
      data.todayUsers || 0;

    document.getElementById("todayRecharge").innerText =
      "₹" + formatMoney(data.todayRecharge);

    document.getElementById("todayWithdraw").innerText =
      "₹" + formatMoney(data.todayWithdraw);

    document.getElementById("todayCommission").innerText =
      "₹" + formatMoney(data.todayCommission);

  } catch (error) {
    console.error("Dashboard Error:", error);
  }
}


// ================= MONEY FORMATTER =================
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}