async function loadDashboard() {
    const users = await fetch(`${API}/admin/users`).then(r => r.json());
    const transactions = await fetch(`${API}/admin/transactions`).then(r => r.json());
  
    totalUsersElement.innerText = users.length;
  
    let recharge = 0, withdraw = 0, pending = 0;
  
    transactions.forEach(t => {
      if (t.type === "recharge" && t.status === "success") recharge += t.amount;
      if (t.type === "withdraw") {
        withdraw += t.amount;
        if (t.status === "processing") pending++;
      }
    });
  
    document.getElementById("totalRecharge").innerText = "₹" + recharge;
    document.getElementById("totalWithdraw").innerText = "₹" + withdraw;
    document.getElementById("pendingWithdraw").innerText = pending;
  }
  
  loadDashboard();
