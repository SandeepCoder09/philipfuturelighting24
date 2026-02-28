/* =====================================
   PHILIPS AUTH - REGISTER SCRIPT (FINAL SAFE)
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  const registerBtn = registerForm.querySelector("button");
  const mobileInput = document.getElementById("mobile");
  const nameInput = document.getElementById("name");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const inviteInput = document.getElementById("inviteCode");

  /* ===============================
     AUTO FILL INVITE CODE
  =============================== */
  const params = new URLSearchParams(window.location.search);
  const invite = params.get("invite");
  if (invite && inviteInput) {
    inviteInput.value = invite;
  }

  /* ===============================
     MOBILE INPUT CONTROL
  =============================== */
  if (mobileInput) {
    mobileInput.addEventListener("input", () => {
      mobileInput.value = mobileInput.value.replace(/\D/g, "");

      if (mobileInput.value.length > 10) {
        mobileInput.value = mobileInput.value.slice(0, 10);
      }
    });
  }

  /* ===============================
     PASSWORD TOGGLE
  =============================== */
  document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  /* ===============================
     LOADING BUTTON
  =============================== */
  function toggleLoading(button, isLoading = true) {
    if (!button) return;

    const btnText = button.querySelector(".btn-text");
    const ledDots = button.querySelector(".led-dots");

    if (!btnText || !ledDots) return;

    if (isLoading) {
      button.disabled = true;
      btnText.classList.add("hidden");
      ledDots.classList.remove("hidden");
    } else {
      button.disabled = false;
      btnText.classList.remove("hidden");
      ledDots.classList.add("hidden");
    }
  }

  /* ===============================
     REGISTER SUBMIT
  =============================== */
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput?.value.trim();
    const mobile = mobileInput?.value.trim();
    const password = passwordInput?.value.trim();
    const confirmPassword = confirmPasswordInput?.value.trim();
    const inviteCode = inviteInput?.value.trim();

    if (!name || !mobile || !password) {
      showPhilipsPopup("Error", "All fields are required", "error");
      return;
    }

    // 🔒 Strict Indian mobile validation
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showPhilipsPopup(
        "Invalid Mobile",
        "Mobile number must start with 6-9 and be 10 digits",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showPhilipsPopup("Error", "Passwords do not match", "error");
      return;
    }

    toggleLoading(registerBtn, true);

    try {

      const res = await authFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          mobile: "+91" + mobile,
          password,
          inviteCode
        })
      });

      let data = {};
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
      }

      toggleLoading(registerBtn, false);

      if (!res.ok) {
        showPhilipsPopup(
          "Registration Failed",
          data.message || "Something went wrong",
          "error"
        );
        return;
      }

      showPhilipsPopup("Success", "Registration successful!", "success");

      setTimeout(() => {
        window.location.href = "../auth/index.html";
      }, 1200);

    } catch (error) {

      toggleLoading(registerBtn, false);

      console.error("Network Error:", error);

      showPhilipsPopup(
        "Server Error",
        "Unable to connect to server.",
        "error"
      );
    }

  });

});