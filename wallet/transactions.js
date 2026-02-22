document.addEventListener("DOMContentLoaded", () => {

  const transactionContainer = document.getElementById("transactionList");
  const filterSelect = document.getElementById("transactionFilter");

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  async function loadTransactions(type = "all") {

    transactionContainer.innerHTML = "Loading...";

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

      transactionContainer.innerHTML = "";

      if (!transactions.length) {
        transactionContainer.innerHTML = "<p>No transactions found</p>";
        return;
      }

      transactions.forEach(tx => {

        const item = document.createElement("div");
        item.className = `transaction-item type-${tx.type}`;

        let statusClass = `status-${tx.status}`;

        item.innerHTML = `
          <div class="transaction-left">
            <div class="transaction-type ${statusClass}">
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
      transactionContainer.innerHTML = "<p>Failed to load transactions</p>";
    }
  }

  filterSelect.addEventListener("change", () => {
    loadTransactions(filterSelect.value);
  });

  loadTransactions();
});