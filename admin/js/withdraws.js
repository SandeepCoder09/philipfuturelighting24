const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "/admin/login.html";
}

async function loadWithdraws() {

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

  data
    .filter(t => t.type === "withdraw")
    .forEach(w => {

      table.innerHTML += `
        <tr>
          <td>
            ${w.userId?.name || "N/A"} <br>
            <small>${w.userId?._id || ""}</small>
          </td>
          <td>₹${w.amount}</td>
          <td class="status-${w.status}">
            ${w.status}
          </td>
          <td>
            ${w.status === "processing" ? `
              <button class="approve" onclick="handleAction('${w.orderId}','approve')">Approve</button>
              <button class="reject" onclick="handleAction('${w.orderId}','reject')">Reject</button>
            ` : ""}
          </td>
        </tr>
      `;
    });
}

async function handleAction(orderId, action) {

  await fetch(`${API}/wallet/withdraw-action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ orderId, action })
  });

  loadWithdraws();
}

loadWithdraws();
