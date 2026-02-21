let allTransactions = [];

async function loadTransactions() {

  const response = await fetch(`${API}/admin/transactions`);
  allTransactions = await response.json();

  renderTransactions("all");
}

function renderTransactions(type) {

  const table = document.getElementById("transactionTable");
  table.innerHTML = "";

  let filtered = allTransactions;

  if (type !== "all") {
    filtered = allTransactions.filter(t => t.type === type);
  }

  filtered.forEach(t => {

    const date = new Date(t.createdAt).toLocaleString();

    table.innerHTML += `
      <tr>
        <td>
  ${t.userId?.name || "N/A"} <br>
  <small>${t.userId?._id || ""}</small>
</td>
        <td>${t.orderId}</td>
        <td>${t.type}</td>
        <td>₹${t.amount}</td>
        <td class="status-${t.status}">
          ${t.status}
        </td>
        <td>${date}</td>
      </tr>
    `;
  });
}

function filterTransactions(type) {
  renderTransactions(type);
}

loadTransactions();
