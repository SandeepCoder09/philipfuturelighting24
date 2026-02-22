const form = document.getElementById("registerForm");
const message = document.getElementById("message");

// Auto-fill invite code from URL
const params = new URLSearchParams(window.location.search);
const invite = params.get("inviteCode");

if (invite) {
  document.getElementById("inviteCode").value = invite;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const inviteCode = document.getElementById("inviteCode").value;

  if (password !== confirmPassword) {
    message.style.color = "red";
    message.innerText = "Passwords do not match";
    return;
  }

  try {
    const res = await fetch("https://philips-backend.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        mobile,
        password,
        inviteCode
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
