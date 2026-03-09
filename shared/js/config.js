/* =====================================
PHILIPS GLOBAL API CONFIG (FINAL STABLE)
===================================== */

const API_BASE = (() => {
  const host = window.location.hostname;

  // Local development
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5001/api";
  }

  // Local network access (mobile / other devices)
  if (host.startsWith("10.") || host.startsWith("192.168.")) {
    return `http://${host}:5001/api`;
  }

  // Production backend
  return "https://philips-backend.onrender.com/api";
})();

/* =====================================
AUTH FETCH WRAPPER
===================================== */

async function authFetch(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("token");

    // Ensure endpoint starts with /
    if (!endpoint.startsWith("/")) {
      endpoint = "/" + endpoint;
    }

    const response = await fetch(API_BASE + endpoint, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });

    return response;

  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

