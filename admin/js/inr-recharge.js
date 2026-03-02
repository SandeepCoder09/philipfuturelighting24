document.addEventListener("DOMContentLoaded", loadInrRecharges);

let allInrRecharges = [];

async function loadInrRecharges() {

  const tbody = document.getElementById("inrTableBody");
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="table-empty">Loading...</td>
    </tr>
  `;

  try {

    const response = await authFetch("/admin/transactions");
    if (!response.ok) throw new Error("Failed");

    const transactions = await response.json();

    // Filter only INR recharges
    allInrRecharges = transactions.filter(tx =>
      tx.type === "recharge" &&
      (!tx.description || !tx.description.toLowerCase().includes("usdt"))
    );

    renderInrTable();

  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="table-empty">
          Failed to load INR recharges
        </td>
      </tr>
    `;
  }
}


function renderInrTable() {

  const tbody = document.getElementById("inrTableBody");
  const searchValue = document.getElementById("searchInr").value.toLowerCase();
  const statusFilter = document.getElementById("inrStatusFilter").value;

  let filtered = allInrRecharges.filter(tx => {

    const matchesSearch =
      tx.userId.toString().includes(searchValue) ||
      (tx.orderId && tx.orderId.toLowerCase().includes(searchValue));

    const matchesStatus =
      !statusFilter ||
      (tx.status && tx.status.toLowerCase() === statusFilter);

    return matchesSearch && matchesStatus;
  });

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="table-empty">
          No INR recharges found
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = "";

  filtered.forEach(tx => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${tx.userId}</td>
      <td>${tx.orderId || "-"}</td>
      <td style="color:#00c6ff;">₹${formatMoney(tx.amount)}</td>
      <td>
        <span class="table-status ${getStatusClass(tx.status)}">
          ${(tx.status || "pending").toUpperCase()}
        </span>
      </td>
      <td>${formatDate(tx.createdAt)}</td>
    `;

    tbody.appendChild(tr);
  });
}


/* Utility Functions */

function getStatusClass(status) {
  if (!status) return "status-pending";
  status = status.toLowerCase();
  if (status === "success") return "status-success";
  if (status === "failed") return "status-rejected";
  return "status-pending";
}

function formatDate(date) {
  return new Date(date).toLocaleString("en-IN");
}

function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}