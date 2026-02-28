// Auto API switch (local + render)
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5001"
    : "https://philips-backend.onrender.com";

function showMessage(type, text) {
  const box = document.getElementById("messageBox");
  box.className = `message-box ${type}`;
  box.textContent = text;
  box.style.display = "block";
}

function toggleButton(button, loading = true) {
  const text = button.querySelector(".btn-text");
  const loader = button.querySelector(".loader");

  if (loading) {
    button.disabled = true;
    text.classList.add("hidden");
    loader.classList.remove("hidden");
  } else {
    button.disabled = false;
    text.classList.remove("hidden");
    loader.classList.add("hidden");
  }
}