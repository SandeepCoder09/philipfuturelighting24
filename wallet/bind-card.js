async function bindBank() {

  const token = localStorage.getItem("token");

  const data = {
    accountNumber: document.getElementById("accountNumber").value,
    ifsc: document.getElementById("ifsc").value,
    holderName: document.getElementById("holderName").value,
    bankName: document.getElementById("bankName").value
  };

  const response = await fetch("https://YOUR_BACKEND_URL/api/wallet/bind-bank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  alert(result.message);
}
