// 🌍 Auto API Switch (Local + Production)
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5001"
    : "https://philips-backend.onrender.com";

document.getElementById("setPinBtn").addEventListener("click", async () => {

  const pin = document.getElementById("pin").value.trim();
  const confirmPin = document.getElementById("confirmPin").value.trim();
  const token = localStorage.getItem("token");
  const toast = document.getElementById("pinToast");

  toast.style.color = "#f87171";
  toast.innerText = "";

  if (!pin || !confirmPin) {
    toast.innerText = "All fields are required.";
    return;
  }

  if (pin.length !== 4 || isNaN(pin)) {
    toast.innerText = "PIN must be 4 digits.";
    return;
  }

  if (pin !== confirmPin) {
    toast.innerText = "PINs do not match.";
    return;
  }

  if (!token) {
    toast.innerText = "Login required.";
    return;
  }

  try {

    const res = await fetch(
      `${API_BASE}/api/users/set-withdraw-pin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ pin })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.innerText = data.message || "Failed to set PIN.";
    } else {
      toast.style.color = "#22c55e";
      toast.innerText = "PIN set successfully! Redirecting...";

      setTimeout(() => {
        window.location.href = "../withdraw.html";
      }, 1500);
    }

  } catch (error) {
    toast.innerText = "Server error.";
  }

});