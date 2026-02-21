async function loadWithdraws() {
    const data = await fetch(`${API}/admin/transactions`).then(r => r.json());
  
    const table = document.getElementById("withdrawTable");
    table.innerHTML = "";
  
    data.filter(t => t.type === "withdraw")
        .forEach(w => {
          table.innerHTML += `
            <tr>
              <td>${w.userId}</td>
              <td>₹${w.amount}</td>
              <td class="status-${w.status}">${w.status}</td>
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action })
    });
    loadWithdraws();
  }
  
  loadWithdraws();