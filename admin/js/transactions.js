document.addEventListener("DOMContentLoaded", () => {
  loadTransactions();
});


/* ==============================
   LOAD TRANSACTIONS
============================== */
async function loadTransactions() {

  const tableBody = document.getElementById("transactionTable");
  if (!tableBody) return;

  try {

    // ✅ REMOVE /api (already inside API_BASE)
    const response = await authFetch(`/admin/transactions`);

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const transactions = await response.json();
    tableBody.innerHTML = "";

    if (!transactions || transactions.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">No transactions found</td>
        </tr>
      `;
      return;
    }

    transactions.forEach(tx => {

      const created = tx.createdAt
        ? new Date(tx.createdAt).toLocaleString("en-GB")
        : "-";

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          ${tx.user?.name || "N/A"}
          <br>
          <small>${tx.user?.userId || ""}</small>
        </td>
        <td>${tx.orderId || "-"}</td>
        <td>${tx.type || "-"}</td>
        <td>₹${formatMoney(tx.amount)}</td>
        <td class="status-${(tx.status || "").replace(/\s+/g, "-")}">
          ${tx.status || "-"}
        </td>
        <td>${created}</td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Transaction Load Error:", error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="6">Failed to load transactions</td>
      </tr>
    `;

    showToast("Failed to load transactions", "error");
  }
}


/* ==============================
   MONEY FORMATTER
============================== */
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}