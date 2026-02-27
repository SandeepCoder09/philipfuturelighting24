document.addEventListener("DOMContentLoaded", async () => {

  const tableBody = document.getElementById("transactionTable");
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "../login.html";
    return;
  }

  try {
    const response = await fetch(`${API}/admin/transactions`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!response.ok) throw new Error("Failed to fetch transactions");

    const transactions = await response.json();
    tableBody.innerHTML = "";

    if (!transactions.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">No transactions found</td>
        </tr>
      `;
      return;
    }

    transactions.forEach(tx => {

      const created = new Date(tx.createdAt).toLocaleString();

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          ${tx.user?.name || "N/A"}
          <br>
          <small>${tx.user?.userId || ""}</small>
        </td>
        <td>${tx.orderId}</td>
        <td>${tx.type}</td>
        <td>₹${tx.amount}</td>
        <td class="status-${tx.status.replace(" ", "-")}">
          ${tx.status}
        </td>
        <td>${created}</td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">Failed to load transactions</td>
      </tr>
    `;
  }

});