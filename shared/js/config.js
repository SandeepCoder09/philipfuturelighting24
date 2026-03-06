/* =====================================
   PHILIPS GLOBAL API CONFIG (FINAL STABLE)
===================================== */

const API_BASE = (() => {
  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5001/api";
  }

  if (host.startsWith("10.") || host.startsWith("192.168.")) {
    return `http://${host}:5001/api`;
  }

  return "https://philips-backend.onrender.com/api";
})();


async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(API_BASE + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
}

