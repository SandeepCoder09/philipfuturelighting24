// 🔹 Backend API Base URL
const API = "https://philips-backend.onrender.com/api";

// 🔐 If already logged in → go to dashboard
if (localStorage.getItem("adminToken")) {
  window.location.href = "dashboard.html";
}

// 🎯 Attach submit event properly (no inline onclick needed)
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("adminLoginForm");

  if (form) {
    form.addEventListener("submit", adminLogin);
  }
});

// 🔑 Admin Login Function
async function adminLogin(event) {

  event.preventDefault(); // 🚨 Stop page reload

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

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      errorBox.innerText = "Invalid server response";
      return;
    }

    if (!response.ok) {
      errorBox.innerText = data.message || "Login failed";
      return;
    }

    // ✅ Save token
    localStorage.setItem("adminToken", data.token);

    // 🚀 Redirect
    window.location.href = "dashboard.html";

  } catch (error) {
    errorBox.innerText = "Network error. Please try again.";
  }
}