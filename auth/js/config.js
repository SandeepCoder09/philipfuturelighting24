window.API =
  window.location.hostname === "localhost" ||
  window.location.hostname.startsWith("10.") ||
  window.location.hostname.startsWith("192.")
    ? "http://localhost:5001/api"
    : "https://philips-backend.onrender.com/api";