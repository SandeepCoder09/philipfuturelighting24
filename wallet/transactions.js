// 🌍 Auto API Switch
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.startsWith("10.");

const API = isLocal
  ? "http://localhost:5001/api"
  : "https://philips-backend.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {

  const transactionContainer = document.getElementById("transactionList");
  const filterSelect = document.getElementById("transactionFilter");

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  function formatType(type) {
    if (!type) return "Other";

    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  async function loadTransactions(type = "all") {

    transactionContainer.innerHTML =
      `<p style="color:#94a3b8;">Loading...</p>`;

    try {

      const response = await fetch(
        `${API}/wallet/transactions?type=${type}`,
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
              ${formatType(tx.type)} • ${tx.status.toUpperCase()}
            </div>
            <div class="transaction-date">
              ${new Date(tx.createdAt).toLocaleString()}
            </div>
            <div class="transaction-id">
              ID: ${tx.orderId}
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
      transactionContainer.innerHTML =
        `<p style="color:#ff4d4d;">Failed to load transactions</p>`;
    }
  }

  filterSelect.addEventListener("change", () => {
    loadTransactions(filterSelect.value);
  });

  loadTransactions();
});