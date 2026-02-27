document.addEventListener("DOMContentLoaded", () => {
  loadBanks();

  const searchInput = document.getElementById("searchBank");
  if (searchInput) {
    searchInput.addEventListener("input", searchBanks);
  }
});

let allBanks = [];


/* ==============================
   LOAD BANKS
============================== */
async function loadBanks() {
  try {

    // 🔥 FIXED: removed ${API}
    const response = await authFetch(`/api/admin/banks`);

    if (!response.ok) {
      throw new Error("Failed to fetch banks");
    }

    allBanks = await response.json();
    renderBanks(allBanks);

  } catch (error) {
    console.error("Error loading banks:", error);
    showToast("Failed to load banks", "error");
  }
}


/* ==============================
   MASK ACCOUNT NUMBER
============================== */
function maskAccount(account) {
  return account ? "****" + account.slice(-4) : "-";
}


/* ==============================
   RENDER BANKS
============================== */
function renderBanks(banks) {

  const table = document.getElementById("bankTable");
  table.innerHTML = "";

  if (!banks || banks.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="6">No bank records found</td>
      </tr>
    `;
    return;
  }

  banks.forEach(bank => {

    const created = bank.createdAt
      ? new Date(bank.createdAt).toLocaleString("en-GB")
      : "-";

    table.innerHTML += `
      <tr>
        <td>
          ${bank.user?.name || "N/A"}
          <br>
          <small>${bank.user?.userId || ""}</small>
        </td>
        <td>${bank.holderName || "-"}</td>
        <td>${bank.bankName || "-"}</td>
        <td>${maskAccount(bank.accountNumber)}</td>
        <td>${bank.ifsc || "-"}</td>
        <td>${created}</td>
      </tr>
    `;
  });
}


/* ==============================
   SEARCH BANKS
============================== */
function searchBanks() {

  const keyword = document
    .getElementById("searchBank")
    .value
    .toLowerCase()
    .trim();

  if (!keyword) {
    renderBanks(allBanks);
    return;
  }

  const filtered = allBanks.filter(bank =>
    bank.user?.userId?.toString().includes(keyword) ||
    bank.user?.name?.toLowerCase().includes(keyword) ||
    bank.bankName?.toLowerCase().includes(keyword)
  );

  renderBanks(filtered);
}

