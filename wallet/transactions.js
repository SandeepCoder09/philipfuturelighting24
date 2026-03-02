/* ==========================================
   PHILIPS TRANSACTIONS SCRIPT (UPDATED)
   - Supports INR + USDT display
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const transactionContainer = document.getElementById("transactionList");
  const filterSelect = document.getElementById("transactionFilter");
  const token = localStorage.getItem("token");

  if (!transactionContainer) return;

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  // ==========================================
  // FORMAT TYPE TEXT
  // ==========================================
  function formatType(type) {
    if (!type) return "Other";

    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // ==========================================
  // DETECT CURRENCY (INR / USDT)
  // ==========================================
  function formatAmount(tx) {

    const isUSDT =
      (tx.description && tx.description.toLowerCase().includes("usdt")) ||
      (tx.network && tx.network.toLowerCase().includes("trc20"));

    if (isUSDT) {
      return `USDT ${tx.amount}`;
    }

    return `₹${tx.amount}`;
  }

  // ==========================================
  // LOAD TRANSACTIONS
  // ==========================================
  async function loadTransactions(type = "all") {

    transactionContainer.innerHTML =
      `<p style="color:#94a3b8;">Loading...</p>`;

    try {

      const response = await authFetch(
        `/wallet/transactions?type=${type}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactions = await response.json();

      transactionContainer.innerHTML = "";

      if (!Array.isArray(transactions) || !transactions.length) {
        transactionContainer.innerHTML =
          `<p style="color:#94a3b8;">No transactions found</p>`;
        return;
      }

      transactions.forEach(tx => {

        const item = document.createElement("div");

        const typeClass = tx.type
          ? tx.type.replace(/\s+/g, "-").toLowerCase()
          : "other";

        const statusClass = tx.status
          ? tx.status.replace(/\s+/g, "-").toLowerCase()
          : "pending";

        item.className = `transaction-item type-${typeClass}`;

        item.innerHTML = `
          <div class="transaction-left">
            <div class="transaction-type status-${statusClass}">
              ${formatType(tx.type)} • ${(tx.status || "pending").toUpperCase()}
            </div>

            <div class="transaction-date">
              ${new Date(tx.createdAt || tx.date).toLocaleString()}
            </div>

            <div class="transaction-id">
              ID: ${tx.orderId || "-"}
            </div>
          </div>

          <div class="transaction-amount">
            ${formatAmount(tx)}
          </div>
        `;

        transactionContainer.appendChild(item);
      });

    } catch (error) {

      console.error("Transaction Load Error:", error);

      transactionContainer.innerHTML =
        `<p style="color:#ff4d4d;">Failed to load transactions</p>`;
    }
  }

  // ==========================================
  // FILTER HANDLER
  // ==========================================
  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      loadTransactions(filterSelect.value);
    });
  }

  loadTransactions();
});