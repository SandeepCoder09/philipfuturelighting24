document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

async function loadDashboard() {

  const token = localStorage.getItem("adminToken");

  // 🔐 Protect page
  if (!token) {
    window.location.href = "pages/login.html";
    return;
  }

  try {
    // ✅ Fetch Users with admin token
    const usersResponse = await fetch(`${API}/admin/users`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!usersResponse.ok) throw new Error("Failed to fetch users");

    const users = await usersResponse.json();

    // ✅ Fetch Transactions with admin token
    const transactionsResponse = await fetch(`${API}/admin/transactions`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!transactionsResponse.ok) throw new Error("Failed to fetch transactions");

    const transactions = await transactionsResponse.json();

    // ✅ Update Total Users
    document.getElementById("totalUsers").innerText = users.length;

    let recharge = 0;
    let withdraw = 0;
    let pending = 0;

    transactions.forEach(t => {
      if (t.type === "recharge" && t.status === "success") {
        recharge += t.amount;
      }

      if (t.type === "withdraw") {
        withdraw += t.amount;

        if (t.status === "processing" || t.status === "pending") {
          pending++;
        }
      }
    });

    // ✅ Update Dashboard Cards
    document.getElementById("totalRecharge").innerText = "₹" + recharge;
    document.getElementById("totalWithdraw").innerText = "₹" + withdraw;
    document.getElementById("pendingWithdraw").innerText = pending;

  } catch (error) {
    console.error("Dashboard Error:", error);
  }
}
