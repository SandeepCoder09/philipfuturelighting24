// 🔹 Replace with your real backend API base URL
const API = "https://philips-backend.onrender.com/api";

// If already logged in, redirect to dashboard
if (localStorage.getItem("adminToken")) {
  window.location.href = "dashboard.html";
}

async function adminLogin() {

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

    // Save token
    localStorage.setItem("adminToken", data.token);

    // Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    errorBox.innerText = "Server error. Please try again.";
  }
}
