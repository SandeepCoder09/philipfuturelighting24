/* ==========================================
   PHILIPS RECORDS SCRIPT (FIXED)
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("recordsContainer");

  const token = localStorage.getItem("token");

  if (!token) {
    container.innerHTML = `
      <div class="empty-state">
        Please login again.
      </div>
    `;
    return;
  }

  // 🔹 SHOW LOADING
  container.innerHTML = `
    <div class="empty-state">
      Loading records...
    </div>
  `;

  try {

    // ✅ Using centralized authFetch
    const res = await authFetch("/wallet/transactions");

    if (!res.ok) {
      throw new Error("Failed to fetch records");
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    // ==========================================
    // 🔹 FILTER BY PAGE TYPE
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
      return dateB - dateA;
    });

    container.innerHTML = "";

    // ==========================================
    // 🔹 RENDER RECORDS
    // ==========================================
    sorted.forEach((tx) => {

      const div = document.createElement("div");
      div.className = "record-item";

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

  } catch (err) {

    console.error("Record Fetch Error:", err);

    container.innerHTML = `
      <div class="empty-state">
        Failed to load records.
      </div>
    `;
  }

});