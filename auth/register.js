const API = "https://philips-backend.onrender.com/api";

const form = document.getElementById("registerForm");
const message = document.getElementById("message");

// ===============================
// AUTO-FILL INVITE CODE FROM URL
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  // 🔥 Must match referral link parameter
  const invite = params.get("invite");

  if (invite) {
    const inviteInput = document.getElementById("inviteCode");
    if (inviteInput) {
      inviteInput.value = invite;
    }
  }
});

// ===============================
// REGISTER USER
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.innerText = "";

  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const inviteCode = document.getElementById("inviteCode").value.trim();

  // Basic validation
  if (!name || !mobile || !password) {
    message.style.color = "red";
    message.innerText = "All fields are required";
    return;
  }

  if (password !== confirmPassword) {
    message.style.color = "red";
    message.innerText = "Passwords do not match";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        mobile,
        password,
        inviteCode // must match backend field
      })
    });

    const data = await res.json();

    if (!res.ok) {
      message.style.color = "red";
      message.innerText = data.message || data.error;
      return;
    }

    message.style.color = "lightgreen";
    message.innerText = "Registration successful!";

    setTimeout(() => {
      window.location.href = "../auth/index.html";
    }, 1500);

  } catch (error) {
    message.style.color = "red";
    message.innerText = "Server error. Try again.";
  }
});
