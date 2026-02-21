document.addEventListener("DOMContentLoaded", async () => {

  const rechargeContainer = document.getElementById("rechargeList");
  const withdrawContainer = document.getElementById("withdrawList");

  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "../login.html";
    return;
  }

  try {
    const response = await fetch(
      "https://philips-backend.onrender.com/api/admin/transactions",
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if (!response.ok) throw new Error("Failed to fetch");

    const transactions = await response.json();

    rechargeContainer.innerHTML = "";
    withdrawContainer.innerHTML = "";

    if (!transactions.length) {
      rechargeContainer.innerHTML = "<p>No recharge history</p>";
      withdrawContainer.innerHTML = "<p>No withdrawal history</p>";
      return;
    }

    transactions.forEach(tx => {

      const item = document.createElement("div");
      item.className = "transaction-item";

      item.innerHTML = `
        <div>
          <strong>User:</strong> ${tx.userId?.name || "N/A"}<br>
          <strong>Status:</strong> ${tx.status}<br>
          <small>${new Date(tx.createdAt).toLocaleString()}</small>
        </div>
        <div>₹${tx.amount}</div>
      `;

      if (tx.type === "recharge") {
        rechargeContainer.appendChild(item);
      } else {
        withdrawContainer.appendChild(item);
      }

    });

  } catch (error) {
    rechargeContainer.innerHTML = "<p>Failed to load</p>";
    withdrawContainer.innerHTML = "<p>Failed to load</p>";
  }

});
