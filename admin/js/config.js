// 🌍 Auto API Switch
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.startsWith("10.")
    ? "http://localhost:5001"
    : "https://philips-backend.onrender.com";

// 🔐 Auth Fetch Wrapper
async function authFetch(url, options = {}) {
  const token = localStorage.getItem("adminToken"); // 🔥 FIXED

  const response = await fetch(API_BASE + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? "Bearer " + token : "",
      ...(options.headers || {})
    }
  });

  // Auto logout on expired
  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
  }

  return response;
}