/* ================= API AUTO SWITCH ================= */

const hostname = window.location.hostname;

const isLocal =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.startsWith("10.") ||
  hostname.startsWith("192.168.") ||
  hostname.endsWith(".local");

const API = isLocal
  ? "http://localhost:5001/api"
  : "https://philips-backend.onrender.com/api";

console.log("Using API:", API);


/* ================= AUTO REDIRECT IF LOGGED IN ================= */

if (localStorage.getItem("adminToken")) {
  window.location.href = "index.html";
}


/* ================= DOM READY ================= */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("adminLoginForm");

  if (form) {
    form.addEventListener("submit", adminLogin);
  }

});


/* ================= ADMIN LOGIN ================= */

async function adminLogin(event) {

  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorBox = document.getElementById("error");
  const submitBtn = document.querySelector("button[type='submit']");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  errorBox.innerText = "";

  if (!email || !password) {
    errorBox.innerText = "Please enter email and password";
    return;
  }

  // Prevent double submit
  submitBtn.disabled = true;
  submitBtn.innerText = "Logging in...";

  try {

    const response = await fetch(`${API}/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    let data = {};

    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error("Invalid server response");
    }

    if (!response.ok) {

      if (response.status === 403) {
        errorBox.innerText = "Your admin account has been suspended.";
      } else if (response.status === 401) {
        errorBox.innerText = "Invalid email or password.";
      } else {
        errorBox.innerText = data.message || "Login failed";
      }

      submitBtn.disabled = false;
      submitBtn.innerText = "Login";
      return;
    }

    // ✅ Save token
    localStorage.setItem("adminToken", data.token);

    // 🚀 Redirect
    window.location.href = "index.html";

  } catch (error) {

    console.error("Admin Login Error:", error);
    errorBox.innerText = "Network error. Please try again.";

    submitBtn.disabled = false;
    submitBtn.innerText = "Login";
  }
}