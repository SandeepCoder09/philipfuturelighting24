/* =====================================
   PHILIPS AUTH - LOGIN SCRIPT (SECURE)
===================================== */

document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  const loginBtn = loginForm.querySelector("button");
  const mobileInput = document.getElementById("mobile");
  const passwordInput = document.getElementById("password");

  /* ===============================
     MOBILE INPUT CONTROL
  =============================== */
  mobileInput.addEventListener("input", () => {
    mobileInput.value = mobileInput.value.replace(/\D/g, "");

    if (mobileInput.value.length > 10) {
      mobileInput.value = mobileInput.value.slice(0, 10);
    }
  });

  /* ===============================
     PASSWORD TOGGLE
  =============================== */
  document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const targetInput = document.getElementById(targetId);

      if (!targetInput) return;

      if (targetInput.type === "password") {
        targetInput.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        targetInput.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  /* ===============================
     LOADING BUTTON
  =============================== */
  function toggleLoading(button, isLoading = true) {
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
     LOGIN SUBMIT
  =============================== */
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mobile = mobileInput.value.trim();
    const password = passwordInput.value.trim();

    if (!mobile || !password) {
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

    toggleLoading(loginBtn, true);

    try {

      const res = await authFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          mobile: "+91" + mobile,
          password
        })
      });

      let data = {};

      try {
        data = await res.json();
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
      }

      toggleLoading(loginBtn, false);

      if (!res.ok) {
        showPhilipsPopup(
          "Login Failed",
          data.message || "Invalid credentials",
          "error"
        );
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", data.token);

      showPhilipsPopup("Success", "Login successful", "success");

      setTimeout(() => {
        window.location.href = "../profile/index.html";
      }, 800);

    } catch (error) {

      toggleLoading(loginBtn, false);

      console.error("Network Error:", error);

      showPhilipsPopup(
        "Server Error",
        "Unable to connect to server.",
        "error"
      );
    }
  });

});