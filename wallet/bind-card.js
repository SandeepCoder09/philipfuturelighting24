async function bindBank() {

  const token = localStorage.getItem("token");
  const messageBox = document.getElementById("messageBox");
  const btnText = document.getElementById("btnText");
  const loader = document.querySelector(".loader");

  const accountNumber = document.getElementById("accountNumber").value.trim();
  const ifsc = document.getElementById("ifsc").value.trim();
  const holderName = document.getElementById("holderName").value.trim();
  const bankName = document.getElementById("bankName").value.trim();

  messageBox.classList.add("hidden");
  messageBox.classList.remove("success", "error");

  if (!accountNumber || !ifsc || !holderName || !bankName) {
    showMessage("Please fill all fields", "error");
    return;
  }

  btnText.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const response = await fetch(
      "https://philips-backend.onrender.com/api/wallet/bind-bank",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          accountNumber,
          ifsc,
          holderName,
          bankName
        })
      }
    );

    const result = await response.json();

    if (response.ok) {
      showMessage(result.message || "Bank submitted successfully", "success");
    } else {
      showMessage(result.message || "Failed to bind bank", "error");
    }

  } catch (error) {
    showMessage("Server error. Please try again.", "error");
  }

  btnText.classList.remove("hidden");
  loader.classList.add("hidden");
}

function showMessage(text, type) {
  const messageBox = document.getElementById("messageBox");
  messageBox.innerText = text;
  messageBox.classList.remove("hidden");
  messageBox.classList.add(type);
}