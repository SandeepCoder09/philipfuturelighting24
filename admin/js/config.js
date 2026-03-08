// 🌍 API BASE

const host = window.location.hostname;
window.API_BASE = `http://${host}:5001/api`;

if (host === "localhost" || host === "127.0.0.1") {
  window.API_BASE = "http://localhost:5001/api";
}
else if (host.startsWith("10.") || host.startsWith("192.168.")) {
  window.API_BASE = `http://${host}:5001/api`;
}
else {
  window.API_BASE = "https://philips-backend.onrender.com/api";
}


// 🔐 ADMIN Auth Fetch Wrapper (STRICT)
async function authFetch(endpoint, options = {}) {

  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "/admin/login.html";
    return;
  }

  const response = await fetch(API_BASE + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  // 🔴 Auto logout if unauthorized
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("adminToken");

    window.location.href = "login.html";
  }

  return response;
}