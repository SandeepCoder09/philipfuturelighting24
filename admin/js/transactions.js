document.addEventListener("DOMContentLoaded", async () => {

  const tableBody = document.getElementById("transactionTable");
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "../login.html";
    return;
  }

  try {
    const response = await fetch(
      "https://philips-backend.onrender.com/api/admin/transactions",
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    if (!response.ok) throw new Error("Failed to fetch");

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

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${tx.userId?.name || "N/A"}</td>
        <td>${tx.orderId}</td>
        <td>${tx.type}</td>
        <td>₹${tx.amount}</td>
        <td>${tx.status}</td>
        <td>${new Date(tx.createdAt).toLocaleString()}</td>
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
