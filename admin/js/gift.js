document.addEventListener("DOMContentLoaded", () => {
  loadGifts();

  // Auto refresh every 10s
  setInterval(loadGifts, 10000);
});

const giftTable = document.getElementById("giftTable");


/* ================= CREATE GIFT ================= */
async function createGift() {

  const code = document.getElementById("giftCode").value.trim();
  const amountPerUser = Number(document.getElementById("amountPerUser").value);
  const totalAmount = Number(document.getElementById("totalAmount").value);

  if (!code || !amountPerUser || !totalAmount) {
    showToast("All fields are required", "error");
    return;
  }

  if (amountPerUser <= 0 || totalAmount <= 0) {
    showToast("Amounts must be greater than 0", "error");
    return;
  }

  try {

    // 🔥 FIXED: removed ${API}
    const res = await authFetch(`/api/gift/create`, {
      method: "POST",
      body: JSON.stringify({
        code,
        amountPerUser,
        totalAmount
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Failed to create gift", "error");
      return;
    }

    showToast("Gift created successfully", "success");

    // Clear inputs
    document.getElementById("giftCode").value = "";
    document.getElementById("amountPerUser").value = "";
    document.getElementById("totalAmount").value = "";

    loadGifts();

  } catch (error) {
    console.error("Create Gift Error:", error);
    showToast("Server error", "error");
  }
}


/* ================= LOAD GIFTS ================= */
async function loadGifts() {

  try {

    // 🔥 FIXED: removed ${API}
    const res = await authFetch(`/api/gift/all`);

    if (!res.ok) {
      throw new Error("Failed to fetch gifts");
    }

    const gifts = await res.json();

    giftTable.innerHTML = "";

    if (!gifts || gifts.length === 0) {
      giftTable.innerHTML = `
        <tr>
          <td colspan="6">No gift codes found</td>
        </tr>
      `;
      return;
    }

    gifts.forEach(gift => {

      const remainingTime = getRemainingTime(gift.expiresAt);
      const status = gift.active ? "Active" : "Inactive";
      const statusClass = gift.active
        ? "status-success"
        : "status-rejected";

      giftTable.innerHTML += `
        <tr>
          <td>${gift.code}</td>
          <td>₹${formatMoney(gift.amountPerUser)}</td>
          <td>₹${formatMoney(gift.totalAmount)}</td>
          <td>₹${formatMoney(gift.remainingAmount)}</td>
          <td>${remainingTime}</td>
          <td class="${statusClass}">${status}</td>
        </tr>
      `;
    });

  } catch (error) {
    console.error("Load Gift Error:", error);
    showToast("Failed to load gifts", "error");
  }
}


/* ================= TIME LEFT ================= */
function getRemainingTime(expiry) {

  if (!expiry) return "-";

  const now = new Date();
  const end = new Date(expiry);

  const diff = end - now;

  if (diff <= 0) return "Expired";

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
}


/* ================= MONEY FORMATTER ================= */
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN");
}