document.addEventListener("DOMContentLoaded", () => {

  const rechargeContainer = document.getElementById("rechargeList");
  const withdrawContainer = document.getElementById("withdrawList");
  const filterSelect = document.getElementById("transactionFilter");

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  async function loadTransactions(type = "all") {

    rechargeContainer.innerHTML = "Loading...";
    withdrawContainer.innerHTML = "Loading...";

    try {
      const response = await fetch(
        `https://philips-backend.onrender.com/api/wallet/transactions?type=${type}`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

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

        if (tx.type === "recharge") {
          item.classList.add("recharge");
        } else if (tx.type === "withdraw") {
          item.classList.add("withdraw");
        }

        let statusClass = "";
        if (tx.status === "success") statusClass = "status-success";
        if (tx.status === "pending" || tx.status === "processing") statusClass = "status-pending";
        if (tx.status === "rejected" || tx.status === "failed") statusClass = "status-rejected";

        item.innerHTML = `
          <div class="transaction-details">
            <div class="${statusClass}">${tx.status.toUpperCase()}</div>
            <div>${new Date(tx.createdAt).toLocaleString()}</div>
          </div>
          <div class="transaction-amount">
            ₹${tx.amount}
          </div>
        `;

        if (tx.type === "recharge") {
          rechargeContainer.appendChild(item);
        }

        if (tx.type === "withdraw") {
          withdrawContainer.appendChild(item);
        }
      });

      if (!rechargeContainer.innerHTML)
        rechargeContainer.innerHTML = "<p>No recharge history</p>";

      if (!withdrawContainer.innerHTML)
        withdrawContainer.innerHTML = "<p>No withdrawal history</p>";

    } catch (error) {
      rechargeContainer.innerHTML = "<p>Failed to load</p>";
      withdrawContainer.innerHTML = "<p>Failed to load</p>";
    }
  }

  filterSelect.addEventListener("change", () => {
    loadTransactions(filterSelect.value);
  });

  loadTransactions();
});