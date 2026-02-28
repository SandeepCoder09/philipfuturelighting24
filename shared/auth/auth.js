/* ==========================================
   PHILIPS GLOBAL AUTH UTILITIES (CLEAN)
========================================== */

// 🌍 Auto API switch (local + LAN + render)

const host = window.location.hostname;

let API_BASE;

if (host === "localhost" || host === "127.0.0.1") {
  API_BASE = "http://localhost:5001";
}
else if (host.startsWith("10.") || host.startsWith("192.168.")) {
  API_BASE = `http://${host}:5001`;
}
else {
  API_BASE = "https://philips-backend.onrender.com";
}


/* ==========================================
   🔐 AUTH FETCH WRAPPER
========================================== */

async function authFetch(url, options = {}) {
  try {
    const response = await fetch(API_BASE + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    return response;

  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}


/* ==========================================
   💬 MESSAGE HELPER
========================================== */

function showMessage(type, text) {
  const box = document.getElementById("messageBox");
  if (!box) return;

  box.className = `message-box ${type}`;
  box.textContent = text;
  box.style.display = "block";
}


/* ==========================================
   🔘 BUTTON LOADING HELPER
========================================== */

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