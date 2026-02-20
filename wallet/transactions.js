const userId = localStorage.getItem("userId");

async function loadTransactions() {
  try {
    const response = await fetch(
      "https://https://philips-backend.onrender.com/api/wallet/transactions/" + userId
    );

    const data = await response.json();
    const container = document.getElementById("transactionList");
    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p class='empty'>No transactions found</p>";
      return;
    }

    data.forEach(txn => {
      const card = document.createElement("div");
      card.className = "transaction-card";

      const typeClass = txn.type === "recharge" ? "recharge" : "withdraw";
      const statusClass = txn.status;

      card.innerHTML = `
        <div class="txn-left">
          <p><strong>Type:</strong> ${txn.type.toUpperCase()}</p>
          <p><strong>Date:</strong> ${new Date(txn.createdAt).toLocaleString()}</p>
          <span class="status ${statusClass}">
            ${txn.status.toUpperCase()}
          </span>
        </div>

        <div class="txn-right">
          <div class="amount ${typeClass}">
            ₹${txn.amount}
          </div>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    document.getElementById("transactionList").innerHTML =
      "<p class='empty'>Failed to load transactions</p>";
  }
}

loadTransactions();