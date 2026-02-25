document.addEventListener("DOMContentLoaded", () => {

  const transactionContainer = document.getElementById("transactionList");
  const filterSelect = document.getElementById("transactionFilter");

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  async function loadTransactions(type = "all") {

    transactionContainer.innerHTML = `
      <p style="color:#94a3b8;">Loading...</p>
    `;

    try {
      const response = await fetch(
        `https://philips-backend.onrender.com/api/wallet/transactions?type=${type}`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const transactions = await response.json();

      transactionContainer.innerHTML = "";

      if (!Array.isArray(transactions) || !transactions.length) {
        transactionContainer.innerHTML = `
          <p style="color:#94a3b8;">No transactions found</p>
        `;
        return;
      }

      // ✅ Sort newest → oldest
      transactions.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      transactions.forEach(tx => {

        const item = document.createElement("div");

        // ✅ Safe type class
        const typeClass = tx.type
          ? tx.type.replace(/\s+/g, "-").toLowerCase()
          : "other";

        item.className = `transaction-item type-${typeClass}`;

        // ✅ Safe status class (handles "under review")
        const statusClass = tx.status
          ? tx.status.replace(/\s+/g, "-").toLowerCase()
          : "pending";

        item.innerHTML = `
          <div class="transaction-left">
            <div class="transaction-type status-${statusClass}">
              ${tx.type.toUpperCase()} • ${tx.status.toUpperCase()}
            </div>
            <div class="transaction-date">
              ${new Date(tx.createdAt).toLocaleString()}
            </div>
          </div>
          <div class="transaction-amount">
            ₹${tx.amount}
          </div>
        `;

        transactionContainer.appendChild(item);
      });

    } catch (error) {
      console.error(error);
      transactionContainer.innerHTML = `
        <p style="color:#ff4d4d;">Failed to load transactions</p>
      `;
    }
  }

  filterSelect.addEventListener("change", () => {
    loadTransactions(filterSelect.value);
  });

  loadTransactions();
});