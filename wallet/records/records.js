/* ==========================================
   PHILIPS RECORDS SCRIPT (UPDATED)
   - Supports INR + USDT display
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("recordsContainer");
  const token = localStorage.getItem("token");

  if (!container) return;

  if (!token) {
    container.innerHTML = `
      <div class="empty-state">
        Please login again.
      </div>
    `;
    return;
  }

  // ==============================
  // LOADING STATE
  // ==============================
  container.innerHTML = `
    <div class="empty-state">
      Loading records...
    </div>
  `;

  try {

    const res = await authFetch("/wallet/transactions");

    if (!res.ok) {
      throw new Error("Failed to fetch records");
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    // ==============================
    // FILTER BY PAGE TYPE
    // ==============================
    const filtered = data.filter((item) => {
      if (!item.type) return false;
      return item.type.toLowerCase() === RECORD_TYPE.toLowerCase();
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          No ${RECORD_TYPE} records found.
        </div>
      `;
      return;
    }

    // ==============================
    // SORT NEWEST FIRST
    // ==============================
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return dateB - dateA;
    });

    container.innerHTML = "";

    // ==============================
    // RENDER RECORDS
    // ==============================
    sorted.forEach((tx) => {

      const div = document.createElement("div");
      div.className = "record-item";

      const statusClass = tx.status
        ? tx.status.replace(/\s+/g, "-").toLowerCase()
        : "pending";

      // 🔥 Detect USDT
      let amountDisplay;

      const isUSDT =
        (tx.description && tx.description.toLowerCase().includes("usdt")) ||
        (tx.network && tx.network.toLowerCase().includes("trc20"));

      if (isUSDT) {
        amountDisplay = `USDT ${tx.amount}`;
      } else {
        amountDisplay = `₹${tx.amount}`;
      }

      div.innerHTML = `
        <div class="record-left">
          <div class="record-type">
            ${tx.type ? tx.type.toUpperCase() : "RECORD"}
          </div>

          <div class="record-date">
            ${new Date(tx.createdAt || tx.date).toLocaleString()}
          </div>

          <div class="record-status status-${statusClass}">
            ${tx.status || "pending"}
          </div>
        </div>

        <div class="record-amount">
          ${amountDisplay}
        </div>
      `;

      container.appendChild(div);
    });

  } catch (err) {

    console.error("Record Fetch Error:", err);

    container.innerHTML = `
      <div class="empty-state">
        Failed to load records.
      </div>
    `;
  }

});