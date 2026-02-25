const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "/admin/login.html";
}

async function loadWithdraws() {
  try {

    const response = await fetch(`${API}/admin/transactions`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login.html";
      return;
    }

    const data = await response.json();

    const table = document.getElementById("withdrawTable");
    table.innerHTML = "";

    const withdraws = data.filter(t => t.type === "withdraw");

    withdraws.forEach(w => {

      let actionHTML = "";

      // ===============================
      // PROCESSING
      // ===============================
      if (w.status === "processing") {
        actionHTML = `
          <button class="action-btn btn-review"
            onclick="handleAction('${w.orderId}', 'under review')">
            Under Review
          </button>
          <button class="action-btn btn-reject"
            onclick="handleAction('${w.orderId}', 'reject')">
            Reject
          </button>
        `;
      }

      // ===============================
      // UNDER REVIEW
      // ===============================
      else if (w.status === "under review") {
        actionHTML = `
          <button class="action-btn btn-approve"
            onclick="handleAction('${w.orderId}', 'approve')">
            Approve
          </button>
          <button class="action-btn btn-reject"
            onclick="handleAction('${w.orderId}', 'reject')">
            Reject
          </button>
        `;
      }

      // ===============================
      // FINAL STATES
      // ===============================
      else {
        actionHTML = `
          <span class="action-label">
            ${w.status}
          </span>
        `;
      }

      table.innerHTML += `
        <tr>
          <td>
            ${w.userId?.name || "N/A"} <br>
            <small>${w.userId?._id || ""}</small>
          </td>
          <td>₹${w.amount}</td>
          <td class="status-${w.status.replace(" ", "-")}">
            ${w.status}
          </td>
          <td>
            ${actionHTML}
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error("Load Withdraw Error:", error);
    showToast("Failed to load withdraws", "error");
  }
}


// ==============================
// HANDLE ACTION
// ==============================
async function handleAction(orderId, action) {

  try {

    const res = await fetch(`${API}/wallet/withdraw-action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ orderId, action })
    });

    const data = await res.json();

    if (res.ok) {
      showToast(data.message, "success");
      loadWithdraws();
    } else {
      showToast(data.message || "Failed to update", "error");
    }

  } catch (error) {
    console.error("Withdraw Action Error:", error);
    showToast("Server error", "error");
  }
}

loadWithdraws();