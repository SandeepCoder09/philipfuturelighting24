const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "/admin/login.html";
}

let allBanks = [];

async function loadBanks() {

  try {
    const response = await fetch(`${API}/admin/banks`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login.html";
      return;
    }

    allBanks = await response.json();
    renderBanks(allBanks);

  } catch (error) {
    console.error("Error loading banks:", error);
  }
}

function maskAccount(account) {
  return account ? "****" + account.slice(-4) : "";
}

function renderBanks(banks) {

  const table = document.getElementById("bankTable");
  table.innerHTML = "";

  if (!banks.length) {
    table.innerHTML = `
      <tr>
        <td colspan="6">No bank records found</td>
      </tr>
    `;
    return;
  }

  banks.forEach(bank => {

    const created = new Date(bank.createdAt).toLocaleDateString();

    table.innerHTML += `
      <tr>
        <td>
          ${bank.user?.name || "N/A"}
          <br>
          <small>${bank.user?.userId || ""}</small>
        </td>
        <td>${bank.holderName}</td>
        <td>${bank.bankName}</td>
        <td>${maskAccount(bank.accountNumber)}</td>
        <td>${bank.ifsc}</td>
        <td>${created}</td>
      </tr>
    `;
  });
}

function searchBanks() {

  const keyword = document.getElementById("searchBank").value.toLowerCase();

  const filtered = allBanks.filter(bank =>
    bank.user?.userId?.toString().includes(keyword) ||
    bank.user?.name?.toLowerCase().includes(keyword) ||
    bank.bankName?.toLowerCase().includes(keyword)
  );

  renderBanks(filtered);
}

loadBanks();