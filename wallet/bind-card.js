async function bindBank() {

  const data = {
    accountNumber: document.getElementById("accountNumber").value,
    ifsc: document.getElementById("ifsc").value,
    holderName: document.getElementById("holderName").value,
    bankName: document.getElementById("bankName").value,
    userId: localStorage.getItem("userId") // store during login
  };

  if (!data.accountNumber || !data.ifsc || !data.holderName) {
    alert("Fill all required fields");
    return;
  }

  try {
    const response = await fetch("https://YOUR_BACKEND_URL/bind-bank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      alert("Bank details submitted. Waiting for admin approval.");
    } else {
      alert(result.message);
    }

  } catch (error) {
    alert("Server error");
  }
}
