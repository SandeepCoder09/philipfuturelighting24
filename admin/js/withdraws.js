/* ==============================
   LOAD WITHDRAWS (UI-BASED FILTERS)
============================== */
async function loadWithdraws() {
  try {

    // 🔥 Always read current UI filter values
    const status = document.getElementById("statusFilter")?.value;
    const userId = document.getElementById("searchUserId")?.value;
    const startDate = document.getElementById("startDate")?.value;
    const endDate = document.getElementById("endDate")?.value;

    const filters = {};

    if (status && status !== "all") filters.status = status;
    if (userId) filters.userId = userId;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const query = new URLSearchParams(filters).toString();

    const response = await authFetch(`/admin/withdraws?${query}`);

    if (!response.ok) {
      throw new Error("Failed to fetch withdraws");
    }

    const withdraws = await response.json();
    const table = document.getElementById("withdrawTable");
    if (!table) return;

    table.innerHTML = "";

    if (!withdraws || withdraws.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;">
            No withdraw records found
          </td>
        </tr>
      `;
      return;
    }

    withdraws.forEach(w => {

      let actionHTML = "";

      if (w.status === "processing") {
        actionHTML = `
          <button class="action-btn btn-review"
            onclick="handleAction('${w._id}', 'under review')">
            Under Review
          </button>
          <button class="action-btn btn-reject"
            onclick="handleAction('${w._id}', 'rejected')">
            Reject
          </button>
        `;
      }

      else if (w.status === "under review") {
        actionHTML = `
          <button class="action-btn btn-approve"
            onclick="handleAction('${w._id}', 'success')">
            Approve
          </button>
          <button class="action-btn btn-reject"
            onclick="handleAction('${w._id}', 'rejected')">
            Reject
          </button>
        `;
      }

      else {
        actionHTML = `
          <span class="action-label">${w.status}</span>
        `;
      }

      table.innerHTML += `
        <tr>
          <td>
            ${w.user?.name || "N/A"}
            <small>${w.user?.userId || ""}</small>
          </td>
          <td>₹${formatMoney(w.amount)}</td>
          <td class="status-${(w.status || "").replace(/\s+/g, "-")}">
            ${w.status}
          </td>
          <td>${actionHTML}</td>
        </tr>
      `;
    });

  } catch (error) {
    console.error("Load Withdraw Error:", error);
    showToast("Failed to load withdraws", "error");
  }
}


/* ==============================
   APPLY FILTERS
============================== */
function applyFilters() {
  loadWithdraws();
}


/* ==============================
   RESET FILTERS
============================== */
function resetFilters() {
  document.getElementById("statusFilter").value = "processing";
  document.getElementById("searchUserId").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";

  loadWithdraws();
}


/* ==============================
   HANDLE ACTION
============================== */
async function handleAction(id, status) {
  try {

    const response = await authFetch(
      `/admin/withdraw/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || "Failed to update", "error");
      return;
    }

    showToast(data.message || "Updated successfully", "success");

    // 🔥 Always refresh with current UI filters
    loadWithdraws();

  } catch (error) {
    console.error("Withdraw Action Error:", error);
    showToast("Server error", "error");
  }
}


/* ==============================
   MONEY FORMATTER
============================== */
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}


/* ==============================
   INITIAL LOAD
============================== */
document.addEventListener("DOMContentLoaded", () => {
  loadWithdraws();
});


/* ==============================
   MAKE GLOBAL FOR SOCKET
============================== */
window.loadWithdraws = loadWithdraws;