// 🌍 Auto API Switch (Local + Production)
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5001"
    : "https://philips-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  const setPinBtn = document.getElementById("setPinBtn");
  const pinInput = document.getElementById("pin");
  const confirmPinInput = document.getElementById("confirmPin");
  const toast = document.getElementById("pinToast");

  // Safety check (prevents JS crash if ID missing)
  if (!setPinBtn || !pinInput || !confirmPinInput || !toast) {
    console.error("Required elements not found in HTML.");
    return;
  }

  // 🔐 Allow only numbers
  pinInput.addEventListener("input", () => {
    pinInput.value = pinInput.value.replace(/\D/g, "").slice(0, 4);
  });

  confirmPinInput.addEventListener("input", () => {
    confirmPinInput.value = confirmPinInput.value.replace(/\D/g, "").slice(0, 4);
  });

  // 🔘 Submit Click
  setPinBtn.addEventListener("click", async () => {

    const pin = pinInput.value.trim();
    const confirmPin = confirmPinInput.value.trim();
    const token = localStorage.getItem("token");

    toast.style.color = "#f87171";
    toast.innerText = "";

    // ✅ Validation
    if (!pin || !confirmPin) {
      toast.innerText = "All fields are required.";
      return;
    }

    if (pin.length !== 4) {
      toast.innerText = "PIN must be exactly 4 digits.";
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
      // Disable button while processing
      setPinBtn.disabled = true;
      setPinBtn.innerText = "Setting PIN...";

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
        setPinBtn.disabled = false;
        setPinBtn.innerText = "Set Secure PIN";
      } else {
        toast.style.color = "#22c55e";
        toast.innerText = "PIN set successfully! Redirecting...";

        setTimeout(() => {
          window.location.href = "../withdraw.html";
        }, 1500);
      }

    } catch (error) {
      console.error("Set PIN Error:", error);
      toast.innerText = "Server error. Try again.";
      setPinBtn.disabled = false;
      setPinBtn.innerText = "Set Secure PIN";
    }

  });

});