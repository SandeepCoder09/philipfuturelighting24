/* ================= API CONFIG ================= */

const API = "http://localhost:5001/api";   // change to production URL when deploying

console.log("Using API:", API);


/* ================= AUTO REDIRECT IF LOGGED IN ================= */

const token = localStorage.getItem("adminToken");

if (token && token !== "undefined" && token !== "null") {
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

    const data = await response.json();

    console.log("ADMIN LOGIN RESPONSE:", data);

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


    /* ================= SAVE TOKEN ================= */

    localStorage.setItem("adminToken", data.token);


    /* ================= SAVE ROLE ================= */

    const role = data.role;

    if (!role) {
      console.error("Role missing from backend response");
      errorBox.innerText = "Server configuration error.";
      return;
    }

    localStorage.setItem("adminRole", role);


    console.log("Saved Token:", localStorage.getItem("adminToken"));
    console.log("Saved Role:", localStorage.getItem("adminRole"));


    /* ================= REDIRECT ================= */

    window.location.href = "index.html";


  } catch (error) {

    console.error("Admin Login Error:", error);

    errorBox.innerText = "Network error. Please try again.";

    submitBtn.disabled = false;
    submitBtn.innerText = "Login";

  }
}