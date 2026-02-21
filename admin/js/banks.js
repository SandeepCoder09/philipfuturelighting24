let allBanks = [];

async function loadBanks() {

  const response = await fetch(`${API}/admin/banks`);
  allBanks = await response.json();

  renderBanks(allBanks);
}

function maskAccount(account) {
  return "****" + account.slice(-4);
}

function renderBanks(banks) {

  const table = document.getElementById("bankTable");
  table.innerHTML = "";

  banks.forEach(bank => {

    const created = new Date(bank.createdAt).toLocaleDateString();

    table.innerHTML += `
      <tr>
        <td>${bank.userId}</td>
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
    bank.userId.toLowerCase().includes(keyword) ||
    bank.bankName.toLowerCase().includes(keyword)
  );

  renderBanks(filtered);
}

loadBanks();