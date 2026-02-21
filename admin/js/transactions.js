const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "/admin/login.html";
}

let allBanks = [];

async function loadBanks() {

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
}

function maskAccount(account) {
  return account ? "****" + account.slice(-4) : "";
}

function renderBanks(banks) {

  const table = document.getElementById("bankTable");
  table.innerHTML = "";

  banks.forEach(bank => {

    const created = new Date(bank.createdAt).toLocaleDateString();

    table.innerHTML += `
      <tr>
        <td>
          ${bank.userId?.name || "N/A"} <br>
          <small>${bank.userId?._id || ""}</small>
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
    bank.userId?._id?.toLowerCase().includes(keyword) ||
    bank.bankName?.toLowerCase().includes(keyword)
  );

  renderBanks(filtered);
}

loadBanks();
