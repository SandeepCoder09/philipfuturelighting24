document.addEventListener("DOMContentLoaded", async () => {

    const rechargeContainer = document.getElementById("rechargeList");
    const withdrawContainer = document.getElementById("withdrawList");
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "../auth/index.html";
      return;
    }
  
    try {
      const response = await fetch(
        "https://philips-backend.onrender.com/api/wallet/transactions",
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
  
      if (transactions.length === 0) {
        rechargeContainer.innerHTML = "<p>No recharge history</p>";
        withdrawContainer.innerHTML = "<p>No withdrawal history</p>";
        return;
      }
  
      transactions.forEach(tx => {
  
        const item = document.createElement("div");
        item.className = "transaction-item";
  
        if (tx.type === "recharge") {
          item.classList.add("recharge");
        } else {
          item.classList.add("withdraw");
        }
  
        let statusClass = "";
        if (tx.status === "success") statusClass = "status-success";
        if (tx.status === "pending") statusClass = "status-pending";
        if (tx.status === "failed") statusClass = "status-failed";
  
        item.innerHTML = `
          <div class="transaction-details">
            <div class="${statusClass}">Status: ${tx.status}</div>
            <div>${new Date(tx.createdAt).toLocaleString()}</div>
          </div>
          <div class="transaction-amount">
            ₹${tx.amount}
          </div>
        `;
  
        if (tx.type === "recharge") {
          rechargeContainer.appendChild(item);
        } else {
          withdrawContainer.appendChild(item);
        }
  
      });
  
      if (!rechargeContainer.innerHTML)
        rechargeContainer.innerHTML = "<p>No recharge history</p>";
  
      if (!withdrawContainer.innerHTML)
        withdrawContainer.innerHTML = "<p>No withdrawal history</p>";
  
    } catch (error) {
      rechargeContainer.innerHTML = "<p>Failed to load recharge history</p>";
      withdrawContainer.innerHTML = "<p>Failed to load withdrawal history</p>";
    }
  
  });