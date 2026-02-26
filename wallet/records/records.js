// 🔹 Get auth token
const token = localStorage.getItem("token");

// 🔹 Get container
const container = document.getElementById("recordsContainer");

// ==========================================
// 🔹 AUTH CHECK
// ==========================================
if (!token) {
  container.innerHTML = `
    <div class="empty-state">
      Please login again.
    </div>
  `;
  throw new Error("No authentication token found");
}

// ==========================================
// 🔹 SHOW LOADING
// ==========================================
container.innerHTML = `
  <div class="empty-state">
    Loading records...
  </div>
`;

// ==========================================
// 🔹 FETCH TRANSACTIONS
// ==========================================
fetch(`${API}/wallet/transactions`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }
})
  .then(async (res) => {
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch");
    }
    return res.json();
  })
  .then((data) => {

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    // ==========================================
    // 🔹 FILTER BY PAGE TYPE (Recharge / Withdraw)
    // ==========================================
    const filtered = data.filter(
      (item) =>
        item.type &&
        item.type.toLowerCase() === RECORD_TYPE.toLowerCase()
    );

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          No ${RECORD_TYPE} records found.
        </div>
      `;
      return;
    }

    // ==========================================
    // 🔹 SORT NEWEST → OLDEST
    // ==========================================
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return dateB - dateA; // newest first
    });

    // Clear loading
    container.innerHTML = "";

    // ==========================================
    // 🔹 RENDER RECORDS
    // ==========================================
    sorted.forEach((tx) => {

      const div = document.createElement("div");
      div.className = "record-item";

      // Convert status safely (handle spaces like "under review")
      const statusClass = tx.status
        ? tx.status.replace(/\s+/g, "-").toLowerCase()
        : "pending";

      div.innerHTML = `
        <div class="record-left">
          <div class="record-type">
            ${tx.type.toUpperCase()}
          </div>

          <div class="record-date">
            ${new Date(tx.createdAt || tx.date).toLocaleString()}
          </div>

          <div class="record-status status-${statusClass}">
            ${tx.status}
          </div>
        </div>

        <div class="record-amount">
          ₹${tx.amount}
        </div>
      `;

      container.appendChild(div);
    });

  })
  .catch((err) => {
    console.error("❌ Fetch Error:", err);

    container.innerHTML = `
      <div class="empty-state">
        Failed to load records.
      </div>
    `;
  });