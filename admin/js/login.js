// 🔹 Backend API Base URL
const API = "https://philips-backend.onrender.com/api";

// 🔐 If already logged in → go to dashboard
if (localStorage.getItem("adminToken")) {
  window.location.href = "index.html"; // ✅ fixed redirect
}

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("adminLoginForm");

  if (form) {
    form.addEventListener("submit", adminLogin);
  }

});

// 🔑 Admin Login Function
async function adminLogin(event) {

  if (event) event.preventDefault(); // ✅ safe check

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  errorBox.innerText = "";

  if (!email || !password) {
    errorBox.innerText = "Please enter email and password";
    return;
  }

  try {

    const response = await fetch(`${API}/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorBox.innerText = data.message || "Login failed";
      return;
    }

    // ✅ Save token
    localStorage.setItem("adminToken", data.token);

    // 🚀 Redirect
    window.location.href = "index.html"; // ✅ correct file

  } catch (error) {
    errorBox.innerText = "Network error. Please try again.";
  }
}
