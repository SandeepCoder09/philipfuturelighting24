// 🌍 Auto API Switch (ADMIN SAFE)

const host = window.location.hostname;

let API_BASE;

if (host === "localhost" || host === "127.0.0.1") {
  API_BASE = "http://localhost:5001/api";
}
else if (host.startsWith("10.") || host.startsWith("192.168.")) {
  API_BASE = `http://${host}:5001/api`;
}
else {
  API_BASE = "https://philips-backend.onrender.com/api";
}


// 🔐 Auth Fetch Wrapper (WITH TOKEN)
async function authFetch(endpoint, options = {}) {

  // 🔥 Check both possible tokens
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token");

  const response = await fetch(API_BASE + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  // 🔴 Auto logout if unauthorized
  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }

  return response;
}