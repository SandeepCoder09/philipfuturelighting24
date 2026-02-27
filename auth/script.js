/* ================= LOGIN ================= */

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  try {

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mobile, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "../profile/index.html";
    } else {
      alert(data.message || "Login failed");
    }

  } catch (error) {
    alert("Server error. Try again.");
  }
});