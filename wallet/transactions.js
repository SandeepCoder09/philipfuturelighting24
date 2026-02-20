document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("transactionList");

  const token = localStorage.getItem("token");

  if (!token) {
    container.innerHTML = "<p>Please login first.</p>";
    window.location.href = "../auth/index.html";
    return;
  }

  try {
    const response = await fetch(
      "https://philips-backend.onrender.com/api/wallet/transactions",
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load transactions");
    }

    const transactions = await response.json();

    if (transactions.length === 0) {
      container.innerHTML = "<p>No transactions found.</p>";
      return;
    }

    container.innerHTML = "";

    transactions.forEach(tx => {

      const item = document.createElement("div");
      item.className = "transaction-item";

      item.innerHTML = `
        <div>
          <strong>${tx.type.toUpperCase()}</strong>
          <p>Status: ${tx.status}</p>
          <p>Date: ${new Date(tx.createdAt).toLocaleString()}</p>
        </div>
        <div>
          ₹${tx.amount}
        </div>
      `;

      container.appendChild(item);
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Failed to load transactions</p>";
  }

});
