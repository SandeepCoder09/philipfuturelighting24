document.addEventListener("DOMContentLoaded", () => {

  const pinBoxes = document.querySelectorAll(".pin-box");
  const confirmBoxes = document.querySelectorAll(".confirm-box");
  const setPinBtn = document.getElementById("setPinBtn");
  const toast = document.getElementById("pinToast");

  // ===== AUTO MOVE & BACKSPACE =====
  function setupPinInputs(boxes) {
    boxes.forEach((box, index) => {

      box.addEventListener("input", () => {
        box.value = box.value.replace(/\D/g, "");

        if (box.value !== "") {
          box.classList.add("filled");
          if (index < boxes.length - 1) {
            boxes[index + 1].focus();
          }
        } else {
          box.classList.remove("filled");
        }
      });

      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && box.value === "" && index > 0) {
          boxes[index - 1].focus();
        }
      });

    });
  }

  setupPinInputs(pinBoxes);
  setupPinInputs(confirmBoxes);

  // ===== SUBMIT PIN =====
  setPinBtn.addEventListener("click", async () => {

    const pin = Array.from(pinBoxes).map(b => b.value).join("");
    const confirmPin = Array.from(confirmBoxes).map(b => b.value).join("");
    const token = localStorage.getItem("token");

    toast.style.color = "#f87171";
    toast.innerText = "";

    if (pin.length !== 4 || confirmPin.length !== 4) {
      toast.innerText = "Enter complete 4-digit PIN.";
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
      setPinBtn.disabled = true;
      setPinBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Setting...';

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
        setPinBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Set Secure PIN';
      } else {
        toast.style.color = "#22c55e";
        toast.innerText = "PIN set successfully!";

        setTimeout(() => {
          window.location.href = "../withdraw.html";
        }, 1500);
      }

    } catch (error) {
      toast.innerText = "Server error.";
      setPinBtn.disabled = false;
      setPinBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Set Secure PIN';
    }

  });

});